# D8 SubRequests

This is a Javascript Client for this Drupal 8 module : https://www.drupal.org/project/subrequests

It executes several JSON-API requests in **one single http request**, & return all JSON responses
in one single Http response as plain JavaScript objects.

## example USAGE

```javascript

const subrequests = new SubRequests("https://dev-contentacms.pantheonsite.io/subrequests?_format=json")
// all categories
subrequests.add({
  requestId: "categories",
  uri: "/api/categories"
})
subrequests.add({
  requestId: "articles",
  uri: "/api/tags"
})
// latest 4 recipes
subrequests.add({
  requestId: "recipes",
  uri: "/api/recipes",
  options: {
    sort:'-created',
    page: { limit: 10 },
    include: ['image', 'image.thumbnail'],
    fields: {
      recipes:['title', 'difficulty', 'image'],
      images: ['name', 'thumbnail'],
      files: ['filename']
    }
  }
})

subrequests.send().then(r => console.log(r))

```

This will :
- format requests in one single request with this format : https://www.drupal.org/project/subrequests
- send a single http requests to the api server
- returns all responses as Objects
