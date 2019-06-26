import {
  over, lensPath, lensProp, flip, mergeDeepRight, mergeDeepWith, mergeWith, mergeRight, compose, union,
} from 'ramda';

const makeStateMerger = merger => getModifier => (state, action) => (
  merger(state, getModifier(action, state))
);
const makeStateMergerWithPath = merger => (path, getModifier) => (state, action) => (
  merger(path, getModifier(action, state), state)
);

const mergeByPathWith = merger => (path, modifier, source) => (
  over(lensPath(path), flip(merger)(modifier), source)
);
const mergeByPropWith = merger => (prop, modifier, source) => (
  over(lensProp(prop), flip(merger)(modifier), source)
);
const concatValues = (left, right) => (
  (Array.isArray(left) && Array.isArray(right) ? union(left, right) : right)
);
const concatValuesReverse = (left, right) => (
  (Array.isArray(left) && Array.isArray(right) ? union(right, left) : right)
);

/* --- mergeIn ---

  Merges action with state

  Example:
    state = { firstName: 'Vasya', age: 18 }
    action = { payload: { lastName: 'Pupkin' } }

   @ In reducers
    mergeIn((action, state) => ({
      bio: `${state.firstName} ${action.payload.lastName} - ${state.age}`
    }))

   @ Result
    state = { firstName: 'Vasya', age: 18, bio: 'Vasya Pupkin - 18' }
*/
export const mergeIn = makeStateMerger(mergeRight);

/* --- mergeByProp ---

  Merges action with state by providen prop

  Example:
    state = { firstName: 'Vasya', age: 18, adress: { street: 'Sobornosty', home: '21', flat: 12 } }
    action = { payload: { floor: 4 } }

   @ In reducers
    mergeByPath('adress', action => action.payload)

   @ Result
    state = {
      firstName: 'Vasya',
      age: 18,
      adress: {
        street: 'Sobornosty',
        home: '21',
        flat: 12,
        floor: 4
      }
    }
*/
export const mergeByProp = makeStateMergerWithPath(mergeByPropWith(mergeRight));

/* --- mergeByPath ---

  Merges action with state by providen path

  Example:
    state = { firstName: 'Vasya', age: 18, adress: { street: 'Sobornosty', home: '21', flat: 12 } }
    action = { payload: { floor: 4 } }

   @ In reducers
    mergeByPath(['adress'], action => action.payload)

   @ Result
    state = {
      firstName: 'Vasya',
      age: 18,
      adress: {
        street: 'Sobornosty',
        home: '21',
        flat: 12,
        floor: 4
      }
    }
*/
export const mergeByPath = makeStateMergerWithPath(mergeByPathWith(mergeRight));

/* --- mergeByPropWithConcat ---

  Works as mergeByProp, but concat's array's instead of replacing them, saves only unique values

  Example:
  state = { firstName: 'Vasya', age: 18, adress: { street: 'Sobornosty', ids: [12, 33, 45] } }
  action = { payload: { ids: [13, 77, 12], key: 17 } }

  @ In reducers
  mergeByPropWithConcat('adress', action => action.payload)

  @ Result
  state = {
    firstName: 'Vasya',
    age: 18,
    adress: {
      street: 'Sobornosty',
      ids: [12, 33, 45, 13, 77],
      key: 17
    }
  }
*/
export const mergeByPropWithConcat = makeStateMergerWithPath(compose(
  mergeByPropWith,
  mergeWith,
)(concatValues));

/* --- mergeByPathWithConcat ---

  Works as mergeByPath, but concat's array's instead of replacing them, saves only unique values

  Example:
  state = { firstName: 'Vasya', age: 18, adress: { street: 'Sobornosty', ids: [12, 33, 45] } }
  action = { payload: { ids: [13, 77, 12], key: 17 } }

  @ In reducers
  mergeByPathWithConcat(['adress'], action => action.payload)

  @ Result
  state = {
    firstName: 'Vasya',
    age: 18,
    adress: {
      street: 'Sobornosty',
      ids: [12, 33, 45, 13, 77],
      key: 17
    }
  }
*/
export const mergeByPathWithConcat = makeStateMergerWithPath(compose(
  mergeByPathWith,
  mergeWith,
)(concatValues));

/* --- mergeDeep ---

  Merges action deep in state

  Example:
    state = { firstName: 'Vasya', age: 18, adress: { street: 'Sobornosty', home: '21', flat: 12 } }
    action = { payload: { adress: { street: 'Bogdana Hmelnitskogo' } } }

   @ In reducers
    mergeDeep(action => action.payload)

   @ Result
    state = {
      firstName: 'Vasya',
      age: 18,
      adress: {
        street: 'Bogdana Hmelnitskogo',
        home: '21',
        flat: 12,
      }
    }
*/
export const mergeDeep = makeStateMerger(mergeDeepRight);

/* --- mergeDeepByProp ---

  Merges action deep in state by providen prop

  Example:
    state = {
      firstName: 'Vasya',
      age: 18,
      friends: {
        'Galya': {
          age: 22,
          phone: 0998283271,
          status: { message: 'Hello' }
        },
        'Petya': {
          age: 17,
          phone: null,
          status: { message: 'Whatsup' }
        },
        'Serhii': {
          age: 21,
          phone: 0957566595,
          status: { message: 'Spearhead' }
        },
      }
    }
    action = {
      payload: {
       'Serhii': {
          status: { message: 'Avanga' }
        }
      }
    }

   @ In reducers
    mergeDeepByProp('friends', ({ payload }) => payload)

   @ Result
    state = {
      firstName: 'Vasya',
      age: 18,
      friends: {
        'Galya': {
          age: 22,
          phone: 0998283271,
          status: { message: 'Hello' }
        },
        'Petya': {
          age: 17,
          phone: null,
          status: { message: 'Whatsup' }
        },
        'Serhii': {
          age: 21,
          phone: 0957566595,
          status: { message: 'Avanga' }
        },
      }
    }
*/
export const mergeDeepByProp = makeStateMergerWithPath(mergeByPropWith(mergeDeepRight));

/* --- mergeDeepByPath ---

  Merges action deep in state by providen path

  Example:
    state = {
      firstName: 'Vasya',
      age: 18,
      friends: {
        'Galya': {
          age: 22,
          phone: 0998283271,
          status: { message: 'Hello' }
        },
        'Petya': {
          age: 17,
          phone: null,
          status: { message: 'Whatsup' }
        },
        'Serhii': {
          age: 21,
          phone: 0957566595,
          status: { message: 'Spearhead' }
        },
      }
    }
    action = {
      payload: {
       'Serhii': {
          status: { message: 'Avanga' }
        }
      }
    }

   @ In reducers
    mergeDeepByPath(['friends'], ({ payload }) => payload)

   @ Result
    state = {
      firstName: 'Vasya',
      age: 18,
      friends: {
        'Galya': {
          age: 22,
          phone: 0998283271,
          status: { message: 'Hello' }
        },
        'Petya': {
          age: 17,
          phone: null,
          status: { message: 'Whatsup' }
        },
        'Serhii': {
          age: 21,
          phone: 0957566595,
          status: { message: 'Avanga' }
        },
      }
    }
*/
export const mergeDeepByPath = makeStateMergerWithPath(mergeByPathWith(mergeDeepRight));

/* --- mergeDeepByPathWithConcat ---

  Works as mergeDeepByPath, but concat's array's instead of replacing them, saves only unique values

  Example:
  state = {
    ...,
    friends: {
      'Galya': {
        age: 22,
        phone: 0998283271,
        statuses: [12, 35, 20]
      },
      'Serhii': {
        age: 21,
        phone: 0957566595,
        statuses: [13, 1, 12]
      },
    }
  }
  action = {
    payload: {
      'Serhii': {
        age: 22,
        statuses: [13, 22, 5]
      }
    }
  }

  @ In reducers
  mergeDeepByPath(['friends'], ({ payload }) => payload)

  @ Result
  state = {
    ...,
    friends: {
      'Galya': {
        age: 22,
        phone: 0998283271,
        statuses: [12, 35, 20]
      },
      'Serhii': {
        age: 21,
        phone: 0957566595,
        statuses: [13, 1, 12, 22, 5]
      },
    }
  }
*/
export const mergeDeepByPathWithConcat = makeStateMergerWithPath(compose(
  mergeByPathWith,
  mergeDeepWith,
)(concatValues));

/* --- mergeDeepByPathWithConcatReverse ---

  Works as mergeDeepByPath, but concat's array's in reverse
  instead of replacing them, saves only unique values

  Example:
  state = {
    ...,
    friends: {
      'Galya': {
        age: 22,
        phone: 0998283271,
        statuses: [12, 35, 20]
      },
      'Serhii': {
        age: 21,
        phone: 0957566595,
        statuses: [13, 1, 12]
      },
    }
  }
  action = {
    payload: {
      'Serhii': {
        age: 22,
        statuses: [13, 22, 5]
      }
    }
  }

  @ In reducers
  mergeDeepByPath(['friends'], ({ payload }) => payload)

  @ Result
  state = {
    ...,
    friends: {
      'Galya': {
        age: 22,
        phone: 0998283271,
        statuses: [12, 35, 20]
      },
      'Serhii': {
        age: 21,
        phone: 0957566595,
        statuses: [13, 22, 5, 1, 12]
      },
    }
  }
*/
export const mergeDeepByPathWithConcatReverse = makeStateMergerWithPath(compose(
  mergeByPathWith,
  mergeDeepWith,
)(concatValuesReverse));
