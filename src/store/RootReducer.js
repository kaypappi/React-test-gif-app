

const initState = {
  gifs: [],
  currentGif:{}
};


const RootReducer = (state = initState, action) => {
  switch (action.type) {
    case "Search":
        console.log(action.searchTerm)
      return { ...state, gifs: [...state.gifs,...action.searchTerm ] };
    case 'ADD_GIF':
        return {...state,currentGif:action.gif}
    default:
      return state;
  }
};

export default RootReducer;
