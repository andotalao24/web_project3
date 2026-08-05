// Curated recipes, preloaded into MongoDB by the seed script.
//
// Ingredient names deliberately use the same vocabulary as pantry items so
// that matching a recipe against someone's pantry is a straight name compare.
// No external recipe API is involved — this is the app's own data.

export const RECIPES = [
  {
    name: 'Spaghetti Aglio e Olio',
    ingredients: ['Pasta', 'Olive Oil', 'Onions'],
    minutes: 20,
    servings: 2,
    steps: [
      'Boil the pasta in well-salted water until just tender.',
      'Warm the olive oil in a pan and soften the sliced onions.',
      'Toss the drained pasta through the oil with a splash of pasta water.',
    ],
  },
  {
    name: 'Scrambled Eggs on Toast',
    ingredients: ['Eggs', 'Butter', 'Bread'],
    minutes: 10,
    servings: 1,
    steps: [
      'Beat the eggs with a pinch of salt.',
      'Melt butter in a cold pan, add the eggs, and stir slowly over low heat.',
      'Pull them off the heat while still glossy and spoon onto toast.',
    ],
  },
  {
    name: 'Egg Fried Rice',
    ingredients: ['Rice', 'Eggs', 'Onions', 'Corn', 'Olive Oil'],
    minutes: 15,
    servings: 2,
    steps: [
      'Use cold, day-old rice — fresh rice turns to mush.',
      'Scramble the eggs, set aside, then fry the onions and corn.',
      'Return the rice and eggs to the pan and toss over high heat.',
    ],
  },
  {
    name: 'Chicken and Broccoli Stir-Fry',
    ingredients: ['Chicken', 'Broccoli', 'Onions', 'Olive Oil', 'Rice'],
    minutes: 25,
    servings: 3,
    steps: [
      'Slice the chicken thinly and sear it in a very hot pan.',
      'Add the broccoli and onions; splash in a little water and cover to steam.',
      'Serve over rice.',
    ],
  },
  {
    name: 'Simple Tomato Pasta',
    ingredients: ['Pasta', 'Tomatoes', 'Onions', 'Olive Oil'],
    minutes: 25,
    servings: 2,
    steps: [
      'Soften the onions in olive oil until sweet, about 8 minutes.',
      'Add chopped tomatoes and simmer until thickened.',
      'Stir through the cooked pasta.',
    ],
  },
  {
    name: 'Grilled Cheese',
    ingredients: ['Bread', 'Cheese', 'Butter'],
    minutes: 10,
    servings: 1,
    steps: [
      'Butter the outer faces of the bread.',
      'Fill with cheese and cook over medium-low heat.',
      'Press gently and flip once the underside is deep golden.',
    ],
  },
  {
    name: 'Overnight Oats',
    ingredients: ['Oats', 'Milk', 'Honey', 'Strawberries'],
    minutes: 5,
    servings: 1,
    steps: [
      'Stir equal parts oats and milk in a jar with a spoonful of honey.',
      'Refrigerate overnight.',
      'Top with sliced strawberries before eating.',
    ],
  },
  {
    name: 'Spinach and Mushroom Omelette',
    ingredients: ['Eggs', 'Spinach', 'Mushrooms', 'Butter', 'Cheese'],
    minutes: 15,
    servings: 1,
    steps: [
      'Fry the mushrooms in butter until browned, then wilt the spinach.',
      'Pour over beaten eggs and cook gently until almost set.',
      'Scatter cheese on one half and fold.',
    ],
  },
  {
    name: 'Baked Salmon with Potatoes',
    ingredients: ['Salmon', 'Potatoes', 'Olive Oil', 'Broccoli'],
    minutes: 35,
    servings: 2,
    steps: [
      'Toss halved potatoes in olive oil and roast at 200C for 20 minutes.',
      'Add the salmon and broccoli to the tray.',
      'Roast 12 more minutes, until the salmon flakes.',
    ],
  },
  {
    name: 'Beef and Potato Stew',
    ingredients: ['Beef', 'Potatoes', 'Onions', 'Carrots'],
    minutes: 90,
    servings: 4,
    steps: [
      'Brown the beef in batches — crowding the pan steams it.',
      'Add onions, carrots and potatoes with enough water to cover.',
      'Simmer gently for an hour until the beef gives way easily.',
    ],
  },
  {
    name: 'Peanut Butter Banana Toast',
    ingredients: ['Bread', 'Peanut Butter', 'Bananas'],
    minutes: 5,
    servings: 1,
    steps: [
      'Toast the bread well so it holds up.',
      'Spread peanut butter while warm.',
      'Top with sliced banana and a pinch of salt.',
    ],
  },
  {
    name: 'Chicken Salad',
    ingredients: ['Chicken', 'Lettuce', 'Tomatoes', 'Olive Oil'],
    minutes: 20,
    servings: 2,
    steps: [
      'Season and pan-fry the chicken, then rest it before slicing.',
      'Tear the lettuce and quarter the tomatoes.',
      'Dress with olive oil, salt and whatever acid you have.',
    ],
  },
  {
    name: 'Black Bean Rice Bowl',
    ingredients: ['Beans', 'Rice', 'Corn', 'Tomatoes'],
    minutes: 20,
    servings: 2,
    steps: [
      'Warm the beans with a little of their liquid.',
      'Char the corn in a dry pan for a smoky edge.',
      'Pile everything over rice with chopped tomatoes.',
    ],
  },
  {
    name: 'Mushroom Risotto',
    ingredients: ['Rice', 'Mushrooms', 'Onions', 'Butter', 'Cheese'],
    minutes: 40,
    servings: 3,
    steps: [
      'Soften onions in butter, add rice and toast it for a minute.',
      'Add hot stock or water a ladle at a time, stirring, until creamy.',
      'Fold through fried mushrooms and cheese off the heat.',
    ],
  },
  {
    name: 'Yogurt Berry Parfait',
    ingredients: ['Yogurt', 'Strawberries', 'Oats', 'Honey'],
    minutes: 5,
    servings: 1,
    steps: [
      'Toast the oats in a dry pan until fragrant.',
      'Layer yogurt, strawberries and oats in a glass.',
      'Finish with honey.',
    ],
  },
  {
    name: 'Pancakes',
    ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Honey'],
    minutes: 25,
    servings: 3,
    steps: [
      'Whisk flour, eggs and milk to a smooth batter and rest it 10 minutes.',
      'Cook in a buttered pan until bubbles set on the surface, then flip.',
      'Serve with honey.',
    ],
  },
  {
    name: 'Creamy Spinach Pasta',
    ingredients: ['Pasta', 'Spinach', 'Milk', 'Cheese', 'Butter'],
    minutes: 25,
    servings: 2,
    steps: [
      'Melt butter, add milk and cheese, and stir to a loose sauce.',
      'Wilt the spinach into the sauce.',
      'Toss with pasta, loosening with pasta water as needed.',
    ],
  },
  {
    name: 'Warm Potato Salad',
    ingredients: ['Potatoes', 'Eggs', 'Onions', 'Olive Oil'],
    minutes: 30,
    servings: 3,
    steps: [
      'Boil the potatoes whole, then cut them while still warm.',
      'Hard-boil the eggs and chop roughly.',
      'Dress warm with olive oil and finely sliced raw onion.',
    ],
  },
  {
    name: 'Tomato Soup',
    ingredients: ['Tomatoes', 'Onions', 'Butter', 'Milk'],
    minutes: 35,
    servings: 3,
    steps: [
      'Cook onions slowly in butter without colouring them.',
      'Add tomatoes and simmer 20 minutes, then blend.',
      'Loosen with milk and season generously.',
    ],
  },
  {
    name: 'Chicken Fried Rice',
    ingredients: ['Chicken', 'Rice', 'Eggs', 'Corn', 'Onions'],
    minutes: 20,
    servings: 3,
    steps: [
      'Cook the diced chicken first and set it aside.',
      'Scramble the eggs, add rice, corn and onions, and fry hard.',
      'Return the chicken and toss through.',
    ],
  },
  {
    name: 'Almond Oat Bars',
    ingredients: ['Oats', 'Almonds', 'Honey', 'Butter'],
    minutes: 30,
    servings: 8,
    steps: [
      'Melt butter with honey and stir through oats and chopped almonds.',
      'Press firmly into a lined tin — firm pressing stops crumbling.',
      'Bake 20 minutes at 170C and cool completely before cutting.',
    ],
  },
  {
    name: 'Tomato and Cheese Salad',
    ingredients: ['Tomatoes', 'Cheese', 'Olive Oil', 'Lettuce'],
    minutes: 10,
    servings: 2,
    steps: [
      'Slice the tomatoes thickly and salt them for five minutes.',
      'Layer with cheese over torn lettuce.',
      'Pour over good olive oil just before serving.',
    ],
  },
  {
    name: 'Cheesy Broccoli Bake',
    ingredients: ['Broccoli', 'Cheese', 'Milk', 'Butter', 'Flour'],
    minutes: 40,
    servings: 4,
    steps: [
      'Blanch the broccoli briefly so it keeps its colour.',
      'Make a white sauce from butter, flour and milk; melt in the cheese.',
      'Combine, top with more cheese and bake until bubbling.',
    ],
  },
  {
    name: 'Salmon Rice Bowl',
    ingredients: ['Salmon', 'Rice', 'Broccoli', 'Olive Oil'],
    minutes: 25,
    servings: 2,
    steps: [
      'Roast or pan-sear the salmon skin-side down until crisp.',
      'Steam the broccoli until just tender.',
      'Serve over rice with a drizzle of olive oil.',
    ],
  },
  {
    name: 'Banana Oat Smoothie',
    ingredients: ['Bananas', 'Oats', 'Milk', 'Honey', 'Peanut Butter'],
    minutes: 5,
    servings: 1,
    steps: [
      'Use a frozen banana for thickness without ice.',
      'Blend everything until completely smooth.',
      'Add milk a splash at a time to reach the texture you like.',
    ],
  },
  {
    name: 'Tray-Roasted Vegetables',
    ingredients: ['Potatoes', 'Carrots', 'Broccoli', 'Olive Oil', 'Onions'],
    minutes: 45,
    servings: 4,
    steps: [
      'Cut everything to a similar size so it cooks evenly.',
      'Toss generously in olive oil and spread in a single layer.',
      'Roast at 200C for 35 minutes, turning once.',
    ],
  },
  {
    name: 'French Toast',
    ingredients: ['Bread', 'Eggs', 'Milk', 'Butter', 'Honey'],
    minutes: 15,
    servings: 2,
    steps: [
      'Whisk eggs with milk and soak the bread briefly on both sides.',
      'Fry in butter over medium heat until deeply golden.',
      'Serve with honey.',
    ],
  },
  {
    name: 'Chicken Noodle Soup',
    ingredients: ['Chicken', 'Pasta', 'Carrots', 'Onions'],
    minutes: 45,
    servings: 4,
    steps: [
      'Simmer the chicken with onions and carrots to build a broth.',
      'Lift out the chicken, shred it, and return it to the pot.',
      'Cook the pasta in the broth just before serving.',
    ],
  },
  {
    name: 'Beef and Mushroom Pasta',
    ingredients: ['Beef', 'Pasta', 'Mushrooms', 'Onions', 'Tomatoes'],
    minutes: 40,
    servings: 4,
    steps: [
      'Brown the beef hard, then add onions and mushrooms.',
      'Add tomatoes and simmer 25 minutes until rich.',
      'Toss with pasta and rest a minute before serving.',
    ],
  },
  {
    name: 'Strawberry Almond Yogurt Bowl',
    ingredients: ['Yogurt', 'Strawberries', 'Almonds', 'Honey'],
    minutes: 5,
    servings: 1,
    steps: [
      'Toast the almonds and chop them coarsely.',
      'Spoon yogurt into a bowl and top with strawberries.',
      'Finish with almonds and honey.',
    ],
  },
  {
    name: 'Corn and Bean Salad',
    ingredients: ['Corn', 'Beans', 'Tomatoes', 'Onions', 'Olive Oil'],
    minutes: 15,
    servings: 3,
    steps: [
      'Char the corn in a dry pan and let it cool.',
      'Rinse the beans well and combine with tomatoes and onion.',
      'Dress with olive oil and plenty of salt.',
    ],
  },
  {
    name: 'Cheese Omelette',
    ingredients: ['Eggs', 'Cheese', 'Butter'],
    minutes: 10,
    servings: 1,
    steps: [
      'Beat three eggs until completely uniform.',
      'Cook in foaming butter, drawing the edges in as they set.',
      'Add cheese, fold, and slide out while the centre is still soft.',
    ],
  },
  {
    name: 'Apple Almond Oatmeal',
    ingredients: ['Oats', 'Apples', 'Almonds', 'Milk', 'Honey'],
    minutes: 15,
    servings: 2,
    steps: [
      'Simmer oats with milk, stirring, until creamy.',
      'Grate an apple through at the end so it keeps its freshness.',
      'Top with almonds and honey.',
    ],
  },
  {
    name: 'Buttered Mushrooms on Toast',
    ingredients: ['Mushrooms', 'Butter', 'Bread', 'Onions'],
    minutes: 15,
    servings: 2,
    steps: [
      'Cook the mushrooms in a dry pan first to drive off their water.',
      'Add butter and onions once they squeak and brown.',
      'Pile onto hot toast.',
    ],
  },
  {
    name: 'Potato and Cheese Frittata',
    ingredients: ['Potatoes', 'Eggs', 'Cheese', 'Onions', 'Olive Oil'],
    minutes: 35,
    servings: 4,
    steps: [
      'Fry sliced potatoes and onions gently in olive oil until tender.',
      'Pour over beaten eggs and cook on low until the edges set.',
      'Add cheese and finish under a grill until puffed.',
    ],
  },
];

export default RECIPES;
