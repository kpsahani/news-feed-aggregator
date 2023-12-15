1. Need to install php version > 7.4
2. install packages
3. php artisan migrate
4. set scheduler
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
5. php artisan serve

Note: I have try to configure Dockerize laravel but getting issue but i will learn and impliement 