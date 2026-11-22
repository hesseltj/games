// Short read-aloud stories for Story Spot (grade 2). Each has exactly three questions;
// the first answer in each list is the right one.

export interface Story {
  /** Grade the story is written for (defaults to '2'). */
  grade?: '1' | '2' | '3' | '4' | '5';
  title: string;
  emoji: string;
  lines: string[];
  questions: { q: string; answers: [string, ...string[]] }[];
}

export const STORIES_2: Story[] = [
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

const g = (grade: Story['grade'], list: Story[]) => list.map((s) => ({ ...s, grade }));

export const STORIES_1: Story[] = g('1', [
  {
    title: 'The Red Hat', emoji: '🎩',
    lines: ['Tom has a red hat.', 'The wind blew the hat away.', 'His dog ran and got it.', 'Tom said, “Good dog!”'],
    questions: [
      { q: 'What color is the hat?', answers: ['Red', 'Blue', 'Green', 'Black'] },
      { q: 'What took the hat away?', answers: ['The wind', 'A bird', 'A cat', 'The rain'] },
      { q: 'Who got the hat?', answers: ['The dog', 'Tom', 'Mom', 'A frog'] },
    ],
  },
  {
    title: 'Fun in the Sun', emoji: '🏖️',
    lines: ['Kim went to the beach.', 'She dug in the sand.', 'She found a pink shell.', 'Then she swam in the waves.'],
    questions: [
      { q: 'Where did Kim go?', answers: ['The beach', 'The zoo', 'School', 'The park'] },
      { q: 'What did she find?', answers: ['A shell', 'A crab', 'A ball', 'A hat'] },
      { q: 'What did she do last?', answers: ['She swam', 'She ate lunch', 'She slept', 'She dug'] },
    ],
  },
  {
    title: 'Big Bug', emoji: '🐞',
    lines: ['Sam saw a bug on a leaf.', 'The bug was red with black spots.', 'It was a ladybug!', 'It flew up to the sky.'],
    questions: [
      { q: 'Where was the bug?', answers: ['On a leaf', 'On a rock', 'In a cup', 'On a dog'] },
      { q: 'What kind of bug was it?', answers: ['A ladybug', 'An ant', 'A bee', 'A worm'] },
      { q: 'Where did the bug go?', answers: ['Up to the sky', 'Into the dirt', 'Into the house', 'Under a rock'] },
    ],
  },
  {
    title: 'Cake for Dad', emoji: '🎂',
    lines: ['It was Dad’s birthday.', 'Mom and Jen made a cake.', 'Jen put on six candles.', 'Dad made a wish and blew them out.'],
    questions: [
      { q: 'Whose birthday was it?', answers: ['Dad’s', 'Mom’s', 'Jen’s', 'Grandma’s'] },
      { q: 'How many candles were there?', answers: ['Six', 'Two', 'Ten', 'One'] },
      { q: 'What did Dad do?', answers: ['Made a wish', 'Went to sleep', 'Ate a pie', 'Sang a song'] },
    ],
  },
  {
    title: 'The Lost Cat', emoji: '🐱',
    lines: ['Pip the cat was lost.', 'Ana looked in the yard.', 'She looked under the bed.', 'Pip was asleep in a box!'],
    questions: [
      { q: 'Who was lost?', answers: ['Pip the cat', 'Ana', 'A dog', 'A bird'] },
      { q: 'Where did Ana look first?', answers: ['In the yard', 'In the car', 'At school', 'In the tub'] },
      { q: 'Where was Pip?', answers: ['In a box', 'In a tree', 'In the yard', 'On the roof'] },
    ],
  },
]);

export const STORIES_3: Story[] = g('3', [
  {
    title: 'The Science Fair', emoji: '🔬',
    lines: ['Priya wanted to know which paper towel was the strongest.', 'She soaked three brands in water and set a coin on each.', 'She kept adding coins until each towel ripped.', 'The blue brand held 24 coins, more than the others.', 'Priya made a poster and won second place.'],
    questions: [
      { q: 'What question was Priya trying to answer?', answers: ['Which paper towel is strongest', 'Which coin is heaviest', 'How fast water dries', 'Which color is prettiest'] },
      { q: 'How did she test the towels?', answers: ['She added coins to wet towels', 'She cut them with scissors', 'She dried them in the sun', 'She asked her friends'] },
      { q: 'What can you tell about Priya?', answers: ['She is curious and careful', 'She does not like science', 'She gave up easily', 'She copied a friend'] },
    ],
  },
  {
    title: 'A Home for Hedgehog', emoji: '🦔',
    lines: ['Winter was coming, and Hedgehog needed a warm place to sleep.', 'The hollow log was too wet, and the hole by the river was too cold.', 'At last she found a pile of dry leaves under a bush.', 'She curled into a ball and slept until spring.'],
    questions: [
      { q: 'Why was Hedgehog looking for a home?', answers: ['Winter was coming', 'She was lost', 'Her friends moved', 'It was too hot'] },
      { q: 'What was wrong with the hollow log?', answers: ['It was too wet', 'It was too small', 'It was too high', 'A fox lived there'] },
      { q: 'What does it mean that she “slept until spring”?', answers: ['She hibernated all winter', 'She took a short nap', 'She could not sleep', 'She woke up early'] },
    ],
  },
  {
    title: 'The Kindness Club', emoji: '💗',
    lines: ['Marcus noticed a new student eating lunch alone.', 'He asked his friends to start a Kindness Club.', 'Every day, someone from the club sat with a student who was alone.', 'Soon, nobody in the school ate lunch by themselves.'],
    questions: [
      { q: 'What problem did Marcus notice?', answers: ['A student was eating alone', 'The lunch was cold', 'The bus was late', 'He lost his lunch'] },
      { q: 'What did the club do?', answers: ['Sat with students who were alone', 'Cleaned the cafeteria', 'Sold cookies', 'Played soccer'] },
      { q: 'What is the lesson of the story?', answers: ['Small acts of kindness can help a lot', 'Always eat lunch fast', 'Clubs are boring', 'New students should be quiet'] },
    ],
  },
  {
    title: 'How Bees Make Honey', emoji: '🐝',
    lines: ['Worker bees fly from flower to flower to collect nectar.', 'They carry it back to the hive in a special stomach.', 'Inside the hive, bees fan their wings to dry the nectar out.', 'When it becomes thick and sweet, it is honey.', 'Bees seal it in wax cells to eat during winter.'],
    questions: [
      { q: 'What do bees collect from flowers?', answers: ['Nectar', 'Honey', 'Wax', 'Seeds'] },
      { q: 'Why do bees fan their wings in the hive?', answers: ['To dry the nectar', 'To keep warm', 'To scare bears', 'To fly away'] },
      { q: 'Why do bees save honey?', answers: ['To eat during winter', 'To give to people', 'To build the hive', 'To feed flowers'] },
    ],
  },
]);

export const STORIES_4: Story[] = g('4', [
  {
    title: 'The Underground Railroad', emoji: '🕯️',
    lines: ['Before the Civil War, many enslaved people escaped to freedom in the North.', 'They traveled at night, often guided by the North Star.', 'Brave helpers hid them in safe houses called “stations.”', 'Harriet Tubman escaped herself and then returned many times to lead others to freedom.'],
    questions: [
      { q: 'What is the main idea of this passage?', answers: ['People bravely helped others escape slavery', 'Trains ran under the ground', 'The North Star is very bright', 'The Civil War was short'] },
      { q: 'Why did people travel at night?', answers: ['To avoid being seen', 'Because it was cooler', 'Because trains ran at night', 'To see fireworks'] },
      { q: 'What does the passage tell us about Harriet Tubman?', answers: ['She was courageous', 'She was a train driver', 'She lived in the South forever', 'She was a farmer'] },
    ],
  },
  {
    title: 'Coral Reefs', emoji: '🐠',
    lines: ['Coral reefs look like colorful rocks, but they are made by tiny animals called polyps.', 'Reefs cover less than one percent of the ocean floor.', 'Yet about one quarter of all ocean fish live around them.', 'Warmer ocean water can cause corals to lose their color and weaken.'],
    questions: [
      { q: 'What builds coral reefs?', answers: ['Tiny animals called polyps', 'Fish', 'Volcanoes', 'People'] },
      { q: 'Why are coral reefs important?', answers: ['Many fish live around them', 'They are made of gold', 'They make waves', 'They cover most of the ocean'] },
      { q: 'What can harm coral reefs?', answers: ['Warmer ocean water', 'Cold winters', 'Moonlight', 'Seaweed'] },
    ],
  },
  {
    title: 'The Stubborn Garden', emoji: '🌱',
    lines: ['Leo planted tomato seeds, but after two weeks nothing had grown.', 'He wanted to dig them up and quit.', 'His grandmother said, “Roots grow before shoots.”', 'He kept watering, and a week later, tiny green sprouts appeared.'],
    questions: [
      { q: 'How did Leo feel after two weeks?', answers: ['Frustrated', 'Excited', 'Scared', 'Sleepy'] },
      { q: 'What did Grandma mean by “Roots grow before shoots”?', answers: ['Growth happens before you can see it', 'Plants grow upside down', 'Shoes need roots', 'Seeds never grow'] },
      { q: 'What is the theme of the story?', answers: ['Be patient and keep trying', 'Gardening is too hard', 'Always listen to the radio', 'Tomatoes are gross'] },
    ],
  },
]);

export const STORIES_5: Story[] = g('5', [
  {
    title: 'The Wright Brothers', emoji: '✈️',
    lines: ['Orville and Wilbur Wright ran a bicycle shop in Ohio.', 'They studied birds to learn how wings control balance.', 'After hundreds of glider tests, they built an engine-powered plane.', 'In 1903, at Kitty Hawk, their Flyer stayed in the air for 12 seconds.', 'That short flight changed travel forever.'],
    questions: [
      { q: 'How did the brothers learn about controlling wings?', answers: ['By studying birds', 'By reading comics', 'By riding trains', 'By asking pilots'] },
      { q: 'Why does the author say the short flight “changed travel forever”?', answers: ['It led to the airplanes we use today', 'It was the longest flight ever', 'It went around the world', 'It replaced bicycles'] },
      { q: 'Which word best describes the brothers?', answers: ['Persistent', 'Careless', 'Lazy', 'Unlucky'] },
    ],
  },
  {
    title: 'The Plastic Problem', emoji: '♻️',
    lines: ['Millions of tons of plastic end up in the ocean every year.', 'Sea turtles can mistake plastic bags for jellyfish and eat them.', 'Some towns have banned single-use bags.', 'Students at one school replaced plastic bottles with refillable ones and cut their trash in half.'],
    questions: [
      { q: 'What is the author’s main purpose?', answers: ['To explain a problem and some solutions', 'To tell a funny story', 'To sell plastic bottles', 'To describe jellyfish'] },
      { q: 'Why do sea turtles eat plastic bags?', answers: ['They look like jellyfish', 'They taste sweet', 'They are hungry for plastic', 'People feed them bags'] },
      { q: 'What evidence shows that small changes help?', answers: ['A school cut its trash in half', 'Turtles like jellyfish', 'Plastic is cheap', 'Oceans are big'] },
    ],
  },
  {
    title: 'The Mapmaker’s Apprentice', emoji: '🗺️',
    lines: ['Elena worked for an old mapmaker who never let her draw.', 'For months she only mixed inks and copied coastlines.', 'One day a sailor needed a map urgently, and the mapmaker was ill.', 'Elena drew the whole harbor from memory, every rock in its place.', 'The mapmaker smiled. “Now you see why you practiced.”'],
    questions: [
      { q: 'Why did the mapmaker have Elena copy coastlines for months?', answers: ['To build her skill', 'To keep her busy', 'Because he was lazy', 'To trick her'] },
      { q: 'What happened when the mapmaker was ill?', answers: ['Elena drew the map herself', 'The sailor left', 'The shop closed', 'Elena got sick too'] },
      { q: 'What is the theme?', answers: ['Practice prepares you for big moments', 'Maps are not useful', 'Sailors are impatient', 'Never trust your teacher'] },
    ],
  },
]);

export const STORIES: Story[] = [...STORIES_1, ...STORIES_2.map((s) => ({ ...s, grade: '2' as const })), ...STORIES_3, ...STORIES_4, ...STORIES_5];
