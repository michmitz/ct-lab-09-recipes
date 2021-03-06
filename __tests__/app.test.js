const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: JSON.stringify([
          {
            name: 'butter',
            amount: 1,
            measurement: 'cup'
          },
          {
            name: 'sugar',
            amount: 2,
            measurement: 'cup'
          },
          {
            name: 'flour',
            amount: 4,
            measurement: 'cup'
          }
        ])
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              name: 'butter',
              amount: 1,
              measurement: 'cup'
            },
            {
              name: 'sugar',
              amount: 2,
              measurement: 'cup'
            },
            {
              name: 'flour',
              amount: 4,
              measurement: 'cup'
            }
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: JSON.stringify([
        {
          name: 'butter',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 2,
          measurement: 'cup'
        },
        {
          name: 'flour',
          amount: 4,
          measurement: 'cup'
        }
      ])
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              name: 'butter',
              amount: 1,
              measurement: 'cup'
            },
            {
              name: 'sugar',
              amount: 2,
              measurement: 'cup'
            },
            {
              name: 'flour',
              amount: 4,
              measurement: 'cup'
            }
          ]
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: JSON.stringify([
        {
          name: 'butter',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 2,
          measurement: 'cup'
        },
        {
          name: 'flour',
          amount: 4,
          measurement: 'cup'
        }
      ])
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              name: 'butter',
              amount: 1,
              measurement: 'cup'
            },
            {
              name: 'sugar',
              amount: 2,
              measurement: 'cup'
            },
            {
              name: 'flour',
              amount: 4,
              measurement: 'cup'
            }
          ]
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: JSON.stringify([
        {
          name: 'butter',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 2,
          measurement: 'cup'
        },
        {
          name: 'flour',
          amount: 4,
          measurement: 'cup'
        }
      ])
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              name: 'butter',
              amount: 1,
              measurement: 'cup'
            },
            {
              name: 'sugar',
              amount: 2,
              measurement: 'cup'
            },
            {
              name: 'flour',
              amount: 4,
              measurement: 'cup'
            }
          ]
        });
      }); 
  });

  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: JSON.stringify([
        {
          name: 'butter',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 2,
          measurement: 'cup'
        },
        {
          name: 'flour',
          amount: 4,
          measurement: 'cup'
        }
      ])
    });

    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2020-03-28',
        notes: 'so tasty',
        rating: 3
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-03-28',
          notes: 'so tasty',
          rating: '3'
        });
      });
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    await Promise.all([
      { 
        recipeId: recipe.id,
        dateOfEvent: '2020-03-28',
        notes: 'so tasty',
        rating: 3 
      },
      { 
        recipeId: recipe.id,
        dateOfEvent: '2020-05-05',
        notes: 'dang that is good',
        rating: 3 
      }
    ].map(log => Log.insertLog(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        expect(res.body).toEqual(expect.arrayContaining([
          {
            id: expect.any(String),
            recipeId: recipe.id,
            dateOfEvent: '2020-03-28',
            notes: 'so tasty',
            rating: '3'
          },
          {
            id: expect.any(String),
            recipeId: recipe.id,
            dateOfEvent: '2020-05-05',
            notes: 'dang that is good',
            rating: '3'  
          }]));
      });
  });

  it('gets a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insertLog({
      recipeId: recipe.id,
      dateOfEvent: '2020-03-28',
      notes: 'so tasty',
      rating: 3 
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-03-28',
          notes: 'so tasty',
          rating: '3' 
        });
      });
  });

  it('updates a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insertLog({
      recipeId: recipe.id,
      dateOfEvent: '2020-03-28',
      notes: 'so tasty',
      rating: 3 
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2020-03-28',
        notes: 'this is actually terrible',
        rating: 2
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-03-28',
          notes: 'this is actually terrible',
          rating: '2'
        });
      });
  });

  it('deletes a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: JSON.stringify([
        {
          name: 'butter',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 2,
          measurement: 'cup'
        },
        {
          name: 'flour',
          amount: 4,
          measurement: 'cup'
        }
      ])
    });

    const log = await Log.insertLog({
      recipeId: recipe.id,
      dateOfEvent: '2020-03-28',
      notes: 'so tasty',
      rating: 3 
    });

    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-03-28',
          notes: 'so tasty',
          rating: '3' 
        });
      }); 
  });
});
