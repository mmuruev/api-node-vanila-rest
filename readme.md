<h3>App with simplest REST API.</h3>
<p>
For db setup
</p>
<pre>db: {
    host: 'localhost', // server name or IP address;
    port: 5432, // PG server port
    database: 'api_platform',
    user: 'api_platform',
    password: 'api_platform'
    }
</pre>



<p>
    Node setup.
</p>
<pre>
    $npm install
</pre>



<p>
    DB Schema script: ./config/init_migration.sql
</p>
<pre>
    CREATE TABLE client
    (
    	id serial primary key,
    	phone varchar(35) not null,
    	email varchar(255) not null,
    	data json not null
    );

</pre>

<p>
    REST INVOCATIONS
</p>
<pre>
    GET  '/api/clients'  search by GET params like "?phone=442071234567"
    POST '/api/client' payload  like
    {
      "phone": "+442071234566",    // required
      "email": "test@email2.com",  // required
      "some": "value",
      "add": "test"
    }

    PUT '/api/client/:id' the sayme payload except ID nothing is manadatory;
    DELETE '/api/client/:id' only ID required success 204 status;
</pre>

