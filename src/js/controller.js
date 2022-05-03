import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.pathname.slice(1);
    //console.log(id);
    if (!id) return;
    // loading recipe
    recipeView.renderSpinner();
    console.log(recipeView);

    // 0) Update results view to mark selected search results

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
    //const recipeView= new recipeView(model.state.recipe)
  } catch (err) {
    recipeView.renderError();
  }
};
//controlRecipes();

//window.addEventListener('hashchange', controlRecipes);
//window.addEventListener('load', controlRecipes);
/*
['hashchange', 'load'].forEach(ev => window.addEventListener(ev.controlRecipes));*/

const controlSearchResults = async function () {
  try {
    //resultsView.renderSpinner();
    //resultsView.renderSpinner();

    /// 1) Get search Query
    const query = searchView.getQuery();
    if (!query) return;
    //console.log(query);

    /// 2)  Load search
    await model.loadSearchResults(query);
    // 3) Render result

    resultsView.render(model.getSearchResultsPage());

    /// render pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW result

  resultsView.render(model.getSearchResultsPage(goToPage));

  /// render NEW pagination buttons

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// Update the recipe servings
  model.updateServings(newServings);

  /// Update the recipe view

  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.state.recipe.bookmarked;
  model.addBookmark(model.state.recipe);
  //else model.state.recipe.bookmarked;
  //model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // REnder spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe

    recipeView.render(model.state.recipe);

    // sucess mesage

    addRecipeView.renderMessage(this._message);

    // close form window

    setTimeout(function () {
      addRecipeView.toogleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('ččč', err);
    addRecipeView.renderError(err.message);
  }

  //console.log(newRecipe);
};

const newfeature = function () {
  console.log('welcome to the application');
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes());
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newfeature();
};
init();
