# V.is.For(Virtual?)
Virtual host manager, manages processes and automates creation of vhosts using node-http-proxy.

### Installation
Node packages as well as bower packages are installable with
<pre>
    npm install
</pre>

Once that completes to compile clientside assets and build dependencies like bootplus use grunt:
<pre>
	grunt
</pre>

Import the sample file which lives in data/sample.json using mongo-import into a db called visfor targeting a collection called apps
<pre>
    mongo -import -h localhost -d visfor -c apps data/app.sample.json
</pre>

The admin interface is available on port 5000. 

### Requirements: 
* Node & NPM 
* Root Access(binds to port 80)
* MongoDB
* Redis(for proxy stats)

### Tools And Tech
* Express
* Mongoose
* node-http-proxy
* Lodash
* AngularJS
* Bower & Grunt(with scafolding from Yeoman)

