### IGOR
Your personal Lab Assistant that helps you manage all of your day-to day Lab activities: From experiment planning and documentation to data management, inventory, project management, cell culture and more….

#### Backend
+ django 2+
+ mysql
+ custome middleware
    + authentication.middleware.jwt_decode_handler

#### Frontend
+ Angular8.0
+ Fuse theme
+ Angular material

#### Hosting
+ aws EC2
+ aws RDS
+ aws S3

#### How to connect to company db for each user
+ added middleware
    + After get user from jwt token, get his company info from default db. And set 'company' database with found company's info
    ```
    JWT_AUTH = {
        ...
        'JWT_DECODE_HANDLER':
        'authentication.middleware.jwt_decode_handler',
        ...
    ```

#### How to start
+ Rename .example.env to .env and add correct information there.
+ `python manage.py makemigrations`
+ IGOR database migrate
    + `python manage.py migrate`
+ Company database migrate
    + `python manage.py migrate --datebase=company`
+ Start server
    + local
        + `python manage.py runserver`
    + server
        + `gunicorn -w 3 --bind 0.0.0.0:8080 backend.wsgi`    


