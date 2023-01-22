export const initialState = false; // 처음 state값으로 count 0을 주었다. state값은 객체, 배열로도 사용할 수 있다.

export const LOADING_START = "LOADING_START"; // count 1을 증가시킬 액션 타입이다.
export const LOADING_END = "LOADING_END"; // count 1을 감소시킬 액션 타입이다.

export const loadingStartAction = () => ({
  // 액션 생성 함수
  type: LOADING_START,
});

export const loadingEndAction = () => ({
  type: LOADING_END,
});

const reducer = (state = initialState, action: any) => {
  // 리듀서
  switch (
    action.type // 액션의 type이 COUNT_PLUS일땐 state에 + 1 COUNT_MINUS 일 땐 state에 -1
  ) {
    case LOADING_START:
      return (state = true);
    case LOADING_END:
      return (state = false);
    default:
      return state;
  }
};

export default reducer;
