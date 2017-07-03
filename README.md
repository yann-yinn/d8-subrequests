# D8 SubRequests

This is a Javascript Client for subrequests Drupal 8 module : https://www.drupal.org/project/subrequests

subrequests allow you to send several json-api requests in **one single http request**.
This package creates for you the blueprint format to send, and can parse the multipart response for you.

## Example usage

```javascript
const subrequests = new SubRequests("https://dev-contentacms.pantheonsite.io/subrequests?_format=json")

subrequests.add({
  uri: "/api/categories"
})
subrequests.add({
  uri: "/api/tags"
}),
subrequests.add({
  uri: "/api/menus"
})
// latest 4 recipes
subrequests.add({
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

const response = await axios.get(subrequests.getUrl())
const datas = subrequests.parseResponse(response.data)
// datas contains now all requests objects

```
