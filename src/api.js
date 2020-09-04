const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Will';

/**
 * listApiFetch - Wrapper function for native `fetch` to standardize error handling. 
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise} -
 */

const listApiFetch = function(...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                error = { code: res.status }
            
            if (!res.headers.get('content-type').includes('json')) {
                error.message = res.statusText;
                return Promise.reject(error);
            }
        }
        return res.json();
    })
    .then(data => {
        if (error) {
            error.message = data.message;
            return Promise.reject(error)
        }
        return data;
    })
};

let getItems = function() {
    // console.log('bookmarks being fetched')
    return listApiFetch(`${BASE_URL}/bookmarks`);
  }

const createItem = function (item) {
    
    const newItem = JSON.stringify(item);
    console.log(item);
    return listApiFetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newItem
    });
  };

const updateItem = function (id, updateData) {
    const newData = JSON.stringify(updateData);
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newData
    });
  };

const deleteItem = function(id) {
    return listApiFetch(BASE_URL + '/bookmarks/' + id, {
        method: 'DELETE'
    })
}

export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};


