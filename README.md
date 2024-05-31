Testing the API
You can use tools like Postman to test the various endpoints:

Register: POST /api/auth/register
Login: POST /api/auth/login
Get Profile: GET /api/auth/profile (Requires Authorization header with JWT token)
Create Post: POST /api/posts (Requires Authorization header with JWT token)
Get All Posts: GET /api/posts
Edit Post: PUT /api/posts/:id (Requires Authorization header with JWT token)
Delete Post: DELETE /api/posts/:id (Requires Authorization header with JWT token)
This setup provides a solid foundation for a blog API with user authentication, profile management, and CRUD operations for blog posts.