import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore, saveRoom } from '../data/store';
import type { Kid, Placement, Room } from '../core/types';
import { BACKDROP_BY_ID, ITEM_BY_ID, ROOMS, ROOM_BY_TYPE, placeable, type CatalogItem, type RoomType } from '../shop/catalog';
import { defaultRoom, equip, isRoomUnlocked, roomId } from '../shop/actions';
import { ItemArt } from '../ui/ItemArt';
import { InvArt } from '../ui/InvArt';
import { sfx } from '../audio/sfx';

const UNIT = 0.14; // item size as a share of room width

function bounds(item: CatalogItem, outdoor: boolean): [number, number] {
  if (outdoor) return [48, 98];
  if (item.layer === 'wall') return [14, 58];
  return [66, 98];
}

export function House({ kid, onBack, onShop }: { kid: Kid; onBack: () => void; onShop: () => void }) {
  const rooms = useStore((s) => s.rooms);
  const inventory = useStore((s) => s.inventory).filter((i) => i.kidId === kid.id);
  const [type, setType] = useState<RoomType>('bedroom');
  const [selected, setSelected] = useState<string | null>(null);
  const [picker, setPicker] = useState<'wallpaper' | 'floor' | null>(null);
  const [drag, setDrag] = useState<{ inv: string; x: number; y: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const dragStart = useRef<{ px: number; py: number; x: number; y: number; moved: boolean } | null>(null);

  const info = ROOM_BY_TYPE[type];
  const room: Room = rooms.find((r) => r.id === roomId(kid.id, type)) ?? defaultRoom(kid.id, type);
  const invById = new Map(inventory.map((i) => [i.id, i]));
  const placedAnywhere = new Set(rooms.filter((r) => r.kidId === kid.id).flatMap((r) => r.placements.map((p) => p.inv)));
  const unplaced = inventory.filter((i) => ITEM_BY_ID[i.itemId] && !placedAnywhere.has(i.id) && placeable(ITEM_BY_ID[i.itemId], info));

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { setSelected(null); setPicker(null); }, [type]);

  function update(placements: Placement[], patch: Partial<Room> = {}) {
    saveRoom({ ...room, ...patch, placements, updatedAt: Date.now() });
  }

  function addItem(invId: string) {
    const item = ITEM_BY_ID[invById.get(invId)!.itemId];
    const [lo, hi] = bounds(item, !!info.outdoor);
    sfx.pop();
    update([...room.placements, { inv: invId, x: 35 + Math.random() * 30, y: item.layer === 'rug' ? hi - 4 : (lo + hi) / 2 + 6 }]);
    setSelected(invId);
  }

  function onPointerDown(e: React.PointerEvent, p: Placement) {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStart.current = { px: e.clientX, py: e.clientY, x: p.x, y: p.y, moved: false };
    setDrag({ inv: p.inv, x: p.x, y: p.y });
  }
  function onPointerMove(e: React.PointerEvent, p: Placement) {
    const s = dragStart.current;
    if (!s || !drag || drag.inv !== p.inv || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const dx = ((e.clientX - s.px) / rect.width) * 100;
    const dy = ((e.clientY - s.py) / rect.height) * 100;
    if (Math.abs(dx) + Math.abs(dy) > 1.5) s.moved = true;
    const item = ITEM_BY_ID[invById.get(p.inv)?.itemId ?? ''];
    const [lo, hi] = item ? bounds(item, !!info.outdoor) : [0, 100];
    setDrag({ inv: p.inv, x: clamp(s.x + dx, 4, 96), y: clamp(s.y + dy, lo, hi) });
  }
  function onPointerUp(p: Placement) {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s || !drag) return;
    if (s.moved) {
      sfx.tap();
      update(room.placements.map((q) => (q.inv === p.inv ? { ...q, x: drag.x, y: drag.y } : q)));
      setSelected(p.inv);
    } else {
      sfx.tap();
      setSelected((cur) => (cur === p.inv ? null : p.inv));
    }
    setDrag(null);
  }

  const shown = room.placements
    .map((p) => (drag && drag.inv === p.inv ? { ...p, x: drag.x, y: drag.y } : p))
    .filter((p) => invById.has(p.inv) && ITEM_BY_ID[invById.get(p.inv)!.itemId])
    .map((p) => ({ p, item: ITEM_BY_ID[invById.get(p.inv)!.itemId] }))
    .sort((a, b) => layerZ(a.item) - layerZ(b.item) || a.p.y - b.p.y);

  const sel = shown.find((s) => s.p.inv === selected);
  const ownedBackdrops = (kind: 'wallpaper' | 'floor') => inventory.map((i) => BACKDROP_BY_ID[i.itemId]).filter((b) => b?.kind === kind);

  const wallCss = info.outdoor ? 'linear-gradient(180deg, #8fd3ff, #d9f1ff)' : BACKDROP_BY_ID[room.wallpaper]?.css ?? '#fff4dc';
  const floorCss = info.outdoor ? 'linear-gradient(180deg, #7fd16b, #5fb84f)' : BACKDROP_BY_ID[room.floor]?.css ?? '#d9a066';

  return (
    <div className="screen house-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <div className="tabs room-tabs">
          {ROOMS.map((r) => {
            const open = isRoomUnlocked(kid.id, r.type);
            return (
              <button key={r.type} className={`tab ${type === r.type ? 'on' : ''} ${open ? '' : 'locked'}`}
                onClick={() => { sfx.tap(); if (open) setType(r.type); else onShop(); }}>
                {open ? r.emoji : '🔒'} {r.name}
              </button>
            );
          })}
        </div>
        <button className="icon-btn" onClick={() => { sfx.tap(); onShop(); }} aria-label="Shop">🛍️</button>
      </div>

      <div className="room-wrap" onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
        <div ref={boxRef} className={`room ${info.outdoor ? 'outdoor' : ''}`} onPointerDown={(e) => { if ((e.target as HTMLElement).classList.contains('room-bg')) setSelected(null); }}>
          <div className="room-bg room-wall" style={{ background: wallCss }} />
          <div className="room-bg room-floor" style={{ background: floorCss }} />
          {info.outdoor && <><div className="room-sun" /><div className="room-fence" /></>}
          {shown.map(({ p, item }) => {
            const px = width * UNIT * (item.size ?? 1);
            const isPet = item.category === 'pets';
            return (
              <div key={p.inv}
                className={`placed ${selected === p.inv ? 'sel' : ''} ${drag?.inv === p.inv ? 'dragging' : ''} ${item.layer === 'rug' ? 'rug' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -100%) scaleX(${p.flip ? -1 : 1})` }}
                onPointerDown={(e) => onPointerDown(e, p)} onPointerMove={(e) => onPointerMove(e, p)}
                onPointerUp={() => onPointerUp(p)} onPointerCancel={() => onPointerUp(p)}>
                <span className={isPet ? 'hop' : ''} style={{ display: 'inline-flex' }}><InvArt invId={p.inv} item={item} size={px} /></span>
              </div>
            );
          })}
          {sel && !drag && (
            <div className="item-tools" style={{ left: `${clamp(sel.p.x, 12, 88)}%`, top: `${Math.max(sel.p.y - 30, 2)}%` }}>
              <button onClick={() => { sfx.tap(); update(room.placements.map((q) => (q.inv === sel.p.inv ? { ...q, flip: !q.flip } : q))); }} aria-label="Flip">↔️</button>
              {sel.item.category === 'pets' && (
                <button onClick={() => { sfx.correct(); equip(kid, { buddy: sel.p.inv }); }} aria-label="Make buddy">{kid.equipped?.buddy === sel.p.inv ? '💖' : '🤍'}</button>
              )}
              <button onClick={() => { sfx.boop(); update(room.placements.filter((q) => q.inv !== sel.p.inv)); setSelected(null); }} aria-label="Put away">📦</button>
            </div>
          )}
        </div>
      </div>

      <div className="drawer">
        {!info.outdoor && (
          <div className="drawer-btns">
            <button className={`chip ${picker === 'wallpaper' ? 'on' : ''}`} onClick={() => { sfx.tap(); setPicker(picker === 'wallpaper' ? null : 'wallpaper'); }}>🎨 Walls</button>
            <button className={`chip ${picker === 'floor' ? 'on' : ''}`} onClick={() => { sfx.tap(); setPicker(picker === 'floor' ? null : 'floor'); }}>🟫 Floor</button>
          </div>
        )}
        <div className="drawer-items">
          {picker ? ownedBackdrops(picker).map((b) => (
            <button key={b.id} className={`drawer-card ${(picker === 'wallpaper' ? room.wallpaper : room.floor) === b.id ? 'sel' : ''}`}
              onClick={() => { sfx.tap(); update(room.placements, picker === 'wallpaper' ? { wallpaper: b.id } : { floor: b.id }); }}>
              <span className="swatch-art" style={{ background: b.css }} /><span>{b.name}</span>
            </button>
          )) : unplaced.length > 0 ? unplaced.map((i) => (
            <button key={i.id} className="drawer-card" onClick={() => addItem(i.id)}>
              <ItemArt item={ITEM_BY_ID[i.itemId]} size={52} /><span>{ITEM_BY_ID[i.itemId].name}</span>
            </button>
          )) : (
            <button className="drawer-card empty" onClick={() => { sfx.tap(); onShop(); }}>
              <span style={{ fontSize: 36 }}>🛍️</span><span>{info.outdoor ? 'Buy yard things with 🍃 Leaves!' : 'Get more stuff in the shop!'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function layerZ(item: CatalogItem) {
  return item.layer === 'rug' ? 0 : item.layer === 'wall' ? 1 : 2;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
