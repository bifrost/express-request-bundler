var db = function() { 
  var data = {
    users: [],
    customers: [
      {
        id: 1,
        name: 'Unicorn Inc.'
      }
    ],
    countries: [
      {
        id: 1,
        name: 'Utopia'
      }
    ]
  };

  for(i = 1; i < 100; i++) {
    data.users.push({
      id: i,
      userName: 'User' + i
    });
  }

  function random (low, high) {
    return Math.random() * (high - low) + low;
  }

  function getTypes() {
    return Object.keys(data);
  }

  function getData() {
    return new Promise(function (resolve, reject) {
      var timeout = setTimeout(function() {
        resolve(data);
      }, random(1000,2000));
    });
  };

  return {
    getTypes: getTypes,
    getData: getData,
  };  
};

module.exports = db;