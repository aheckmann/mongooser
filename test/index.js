
var cp = require('child_process')
  , spawn = cp.spawn
  , assert = require('assert')
  , cmd = require('path').resolve(__dirname + '/../bin/mongooser')

// use mocha
describe('mongooser', function(){
  it('should output help', function(done){
    var repl = spawn(cmd);
    var buf = '';
    var err = '';
    repl.stdout.on('data', function (data) {
      buf += data;
    });
    repl.stderr.on('data', function (data) {
      err += data;
    });
    repl.on('exit', function (code) {
      assert.equal(1, code)
      assert.ok(/Usage: mongooser \[options\]/.test(buf));
      done()
    });
  })

  it('should error when not connecting to the db', function(done){
    var repl = spawn(cmd, ['-c', 'test.js']);
    var buf = '';
    var err = '';
    repl.stdout.on('data', function (data) {
      buf += data;
    });
    repl.stderr.on('data', function (data) {
      err += data;
    });
    repl.on('exit', function (code) {
      assert.ok(/could not load configuration/.test(err));
      assert.equal(1, code)
      done()
    });
  })

  describe('in the repl', function(){
    var repl;

    before(function (done) {
      repl = spawn(cmd, ['-c', __dirname + '/test.js']);
      repl.on('exit', function (a) {
        console.error('  repl is exiting: %s', a);
      });
      repl.stdin.resume();
      test(function(err,out){
        done();
      });
    });

    it('Book should be a function', function (done) {
      test('typeof Book', function (err, out) {
        assert.ifError(err);
        assert.equal("'function'\nmongooser> ", out);
        done();
      });
    });

    it('Book should be a model', function (done) {
      test('typeof Book', function (err, out) {
        assert.ifError(err);
        assert.equal("'function'\nmongooser> ", out);
        done();
      });
    });

    it('print should be a function', function (done) {
      test('typeof print', function (err, out) {
        assert.ifError(err);
        assert.equal("'function'\nmongooser> ", out);
        done();
      });
    });

    it('connection should be a object', function (done) {
      test('typeof connection', function (err, out) {
        assert.ifError(err);
        assert.equal("'object'\nmongooser> ", out);
        done();
      });
    });

    it('schemas should be an object', function (done) {
      test('typeof schemas', function (err, out) {
        assert.ifError(err);
        assert.equal("'object'\nmongooser> ", out);
        done();
      });
    });

    it('mongoose should be an object', function (done) {
      test('typeof mongoose', function (err, out) {
        assert.ifError(err);
        assert.equal("'object'\nmongooser> ", out);
        done();
      });
    });

    it('ObjectId should be global', function(done){
      test('typeof ObjectId', function (err, out) {
        assert.ifError(err);
        assert.equal("'function'\nmongooser> ", out);
        done();
      });
    })

    it('mongoose.Mongoose should be a function', function (done) {
      test('typeof mongoose.Mongoose', function (err, out) {
        assert.ifError(err);
        assert.equal("'function'\nmongooser> ", out);
        done();
      });
    });

    it('should remove all Books', function(done){
      test('Book.remove(function(){Book.count(print)})', function (err, out) {
        assert.ifError(err);
        assert.ok(/null 0\nmongooser> $/.test(out));
        done();
      });
    })

    it('should be able to create Books', function(done){
      var code = 'Book.create({title:"A Tale of Two Cities"},function(){'
               + '  Book.findOne(print);'
               + '});'
      test(code, function(err, out){
        assert.ifError(err);
        assert.ok(/title: 'A Tale of Two Cities'/.test(out));
        done();
      });
    })

    it('should run queries', function(done){
      var code = 'Book.find().where("title").equals("A Tale of Two Cities")'
               + '.exec(print);'
      test(code, function(err, out){
        assert.ifError(err);
        assert.ok(/title: 'A Tale of Two Cities'/.test(out));
        done();
        finish();
      });
    })

    function finish () {
      repl.stdin.end();
      repl.stdout.end();
      repl.stderr.end();
      repl.kill();
    }

    function test (str, cb) {
      if ('function' == typeof str) cb = str, str = undefined
      var out = ''
      var outLength = 0
      var errLength = 0
      var err = ''
      var timer

      repl.stdout.on('data', function (data) {
        out += data;
      });
      repl.stderr.on('data', function (data) {
        err += data;
      });

      if (str && (str = str.trim())) {
        repl.stdin.write(str + '\n');
      }

      function wait () {
        if (outLength > out.length || errLength > err.length) {
          outLength = out.length
          errLength = err.length
          return timer = setTimeout(wait, 200);
        }
        repl.stdout.removeAllListeners('data');
        repl.stderr.removeAllListeners('data');
        cb(err, out);
        out = err = outLength = errLength = timer = null
      };
      timer = setTimeout(wait, 300);
    }
  })
})
