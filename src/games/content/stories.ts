// Short read-aloud stories for Story Spot (grade 2). Each has exactly three questions;
// the first answer in each list is the right one.

export interface Story {
  title: string;
  emoji: string;
  lines: string[];
  questions: { q: string; answers: [string, ...string[]] }[];
}

export const STORIES: Story[] = [
  {
    title: 'The Lost Kite', emoji: '🪁',
    lines: ['Maya flew her red kite at the park.', 'A big gust of wind pulled the string out of her hand.', 'The kite got stuck high in an oak tree.', 'Her brother Leo used a long stick to wiggle it free.', 'Maya gave Leo a big hug.'],
    questions: [
      { q: 'What color was the kite?', answers: ['Red', 'Blue', 'Green', 'Yellow'] },
      { q: 'Where did the kite get stuck?', answers: ['In a tree', 'On a roof', 'In a pond', 'On a car'] },
      { q: 'Why did Maya hug Leo?', answers: ['He got her kite back', 'It was his birthday', 'He was sad', 'He found a puppy'] },
    ],
  },
  {
    title: 'Pancake Morning', emoji: '🥞',
    lines: ['On Saturday, Dad made pancakes.', 'Sam cracked two eggs into the bowl.', 'Nora stirred in the milk and flour.', 'Dad flipped each pancake high in the air.', 'They ate them with strawberries on top.'],
    questions: [
      { q: 'What day was it?', answers: ['Saturday', 'Monday', 'Friday', 'Sunday'] },
      { q: 'How many eggs did Sam crack?', answers: ['Two', 'One', 'Three', 'Six'] },
      { q: 'What did they put on top?', answers: ['Strawberries', 'Bananas', 'Chocolate', 'Syrup'] },
    ],
  },
  {
    title: 'The Snow Day', emoji: '⛄',
    lines: ['Snow fell all night long.', 'In the morning, there was no school!', 'Ava and Ben put on hats, mittens, and boots.', 'They rolled three big balls of snow.', 'They used a carrot for the snowman’s nose.'],
    questions: [
      { q: 'Why was there no school?', answers: ['It snowed', 'It was summer', 'The bus broke', 'It was a holiday'] },
      { q: 'What did they build?', answers: ['A snowman', 'A fort', 'A sled', 'An igloo'] },
      { q: 'What was the nose made of?', answers: ['A carrot', 'A rock', 'A stick', 'A button'] },
    ],
  },
  {
    title: 'Max the Puppy', emoji: '🐶',
    lines: ['Max is a small brown puppy.', 'He loves to chase his ball.', 'One day the ball rolled under the couch.', 'Max barked and barked until Grandma came.', 'Grandma got the ball, and Max wagged his tail.'],
    questions: [
      { q: 'What color is Max?', answers: ['Brown', 'White', 'Black', 'Gray'] },
      { q: 'Where did the ball roll?', answers: ['Under the couch', 'Into the yard', 'Down the stairs', 'Into the pool'] },
      { q: 'How did Max feel at the end?', answers: ['Happy', 'Sad', 'Angry', 'Sleepy'] },
    ],
  },
  {
    title: 'The Class Garden', emoji: '🌻',
    lines: ['Mr. Lee’s class planted seeds in a garden.', 'Every day, the kids gave the seeds water.', 'The sun helped the plants grow tall.', 'After six weeks, big yellow sunflowers bloomed.', 'Bees came to visit the flowers.'],
    questions: [
      { q: 'What did the class plant?', answers: ['Seeds', 'Trees', 'Rocks', 'Carrots'] },
      { q: 'What did the kids give the seeds every day?', answers: ['Water', 'Milk', 'Candy', 'Sand'] },
      { q: 'What color were the flowers?', answers: ['Yellow', 'Red', 'Purple', 'Pink'] },
    ],
  },
  {
    title: 'Rocket to the Moon', emoji: '🚀',
    lines: ['Zoe built a rocket out of a big box.', 'She painted it silver and drew stars on the side.', 'She counted down: five, four, three, two, one!', 'Then she pretended to fly to the moon.', 'Her cat climbed in to be her co-pilot.'],
    questions: [
      { q: 'What was the rocket made of?', answers: ['A box', 'Metal', 'Paper plates', 'Wood'] },
      { q: 'Where did Zoe pretend to fly?', answers: ['To the moon', 'To the beach', 'To school', 'To the zoo'] },
      { q: 'Who was the co-pilot?', answers: ['Her cat', 'Her dad', 'Her dog', 'Her friend'] },
    ],
  },
  {
    title: 'The Big Game', emoji: '⚽',
    lines: ['Jada’s soccer team had a big game.', 'The other team scored first.', 'Jada did not give up.', 'She kicked the ball past the goalie just before the end.', 'The game ended in a tie, one to one.'],
    questions: [
      { q: 'What sport did Jada play?', answers: ['Soccer', 'Baseball', 'Tennis', 'Basketball'] },
      { q: 'Who scored first?', answers: ['The other team', 'Jada', 'The goalie', 'Nobody'] },
      { q: 'How did the game end?', answers: ['In a tie', 'Jada’s team won', 'Jada’s team lost', 'It rained'] },
    ],
  },
  {
    title: 'Owl at Night', emoji: '🦉',
    lines: ['Owls sleep during the day.', 'When it gets dark, they wake up to hunt.', 'Owls have big eyes to see at night.', 'They can turn their heads very far around.', 'Their soft feathers help them fly without a sound.'],
    questions: [
      { q: 'When do owls sleep?', answers: ['During the day', 'At night', 'In the winter', 'Never'] },
      { q: 'What helps owls see at night?', answers: ['Big eyes', 'Long legs', 'Sharp claws', 'A flashlight'] },
      { q: 'Why can owls fly so quietly?', answers: ['Soft feathers', 'Small wings', 'They hop', 'Big feet'] },
    ],
  },
  {
    title: 'The Lemonade Stand', emoji: '🍋',
    lines: ['It was a hot summer day.', 'Eli and his sister made lemonade.', 'They sold each cup for one quarter.', 'By lunchtime, they had sold ten cups.', 'They used the money to buy a gift for Mom.'],
    questions: [
      { q: 'What did they sell?', answers: ['Lemonade', 'Cookies', 'Ice cream', 'Toys'] },
      { q: 'How many cups did they sell?', answers: ['Ten', 'Two', 'Five', 'Twenty'] },
      { q: 'What did they do with the money?', answers: ['Bought a gift for Mom', 'Bought candy', 'Saved it', 'Gave it to a friend'] },
    ],
  },
  {
    title: 'Turtle’s Trip', emoji: '🐢',
    lines: ['Turtle wanted to see the ocean.', 'He walked slowly for three days.', 'A friendly crab showed him the way.', 'At last, he saw the blue waves.', 'Turtle swam in the warm water and smiled.'],
    questions: [
      { q: 'Where did Turtle want to go?', answers: ['The ocean', 'The mountains', 'A city', 'The forest'] },
      { q: 'Who helped Turtle?', answers: ['A crab', 'A bird', 'A fish', 'A frog'] },
      { q: 'How long did Turtle walk?', answers: ['Three days', 'One hour', 'One week', 'Ten days'] },
    ],
  },
];
