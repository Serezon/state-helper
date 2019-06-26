import * as R from 'ramda';

import {
  mergeByPath, mergeByPathWithConcat, mergeDeep, mergeDeepByPath,
  mergeDeepByPathWithConcat, mergeDeepByPathWithConcatReverse, mergeIn,
  mergeByProp, mergeByPropWithConcat, mergeDeepByProp,
} from './stateHelpers';

let state
beforeEach(() => {
  state = {
    users: {
      result: [1,2,3,4],
      entities: {
        1: {
          id: 1,
          age: 22,
          phone: '0998283271',
          status: { message: 'Hello', active: true },
        },
        2: {
          id: 2,
          age: 17,
          phone: '88005553535',
          status: { message: 'Whatsup', active: false },
        },
        3: {
          id: 3,
          age: 21,
          phone: '0957566595',
          status: { message: 'Avanga', active: true },
        },
        4: {
          id: 4,
          name: 'Pasha',
          age: 19,
          phone: '0976974737',
          status: { message: 'Writing tests...', active: true },
        },
      },
    },
    messages: {
      count: 8,
      result: [1,2,3,4,5,6,7,8],
      entities: {
        1: {
          id: 1,
          content: 'Hello everyone',
          by: 2,
        },
        2: {
          id: 2,
          content: 'Hi',
          by: 1,
        },
        3: {
          id: 3,
          content: 'Creating kostilyaki',
          by: 3,
        },
        4: {
          id: 4,
          content: 'Joking',
          by: 3,
        },
        5: {
          id: 5,
          content: 'Need some help there',
          by: 3,
        },
        6: {
          id: 6,
          content: 'Here i come',
          by: 4,
        },
        7: {
          id: 7,
          content: 'Lets create kostilyaki together',
          by: 4,
        },
        8: {
          id: 8,
          content: 'Theyre gone',
          by: 1,
        },
      },
    },
    user: {
      name: 'John Doe',
      age: 29,
      phone: '0986536547',
      status:  { message: 'Why am i here?', active: false },
    },
    isLoading: false,
  };
});
// For simplicity we're gonna assume that actions are payloads
describe('mergeIn', () => {
  it('should override single prop', () => {
    const result = mergeIn(R.identity)(state, { isLoading: true });

    state.isLoading = true;

    expect(result).toEqual(state);
  });

  it('should override few props', () => {
    const result = mergeIn(R.identity)(state, { messages: null, user: {} });

    state = {
      ...state,
      messages: null,
      user: {},
    };

    expect(result).toEqual(state);
  });
});

describe('mergeByProp', () => {
  it('should override providen property', () => {
    const result = mergeByProp('messages', R.identity)(state, { count: 12 });

    state.messages.count = 12;

    expect(result).toEqual(state)
  })
});
