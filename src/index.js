import $ from 'jquery';
import './styles.css';
import list from './bookmarks';

const main = function () {
    list.initialize();
    list.bindEventListeners();
  };
  
  $(main);
  