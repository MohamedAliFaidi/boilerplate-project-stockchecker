const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    test('1 stock', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog'})
         .end(function(err, res){
           assert.equal(res.body['stockData']['stock'], 'goog')
           assert.isNotNull(res.body['stockData']['price'])
            assert.isNotNull(res.body['stockData']['likes'])
           done();
         });
       });
       test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          assert.equal(res.body['stockData']['stock'], 'aapl')
          assert.isNumber(res.body['stockData']['likes']) 
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          assert.equal(res.body.Error, 'Only 1 Like per IP Allowed')
          done()
        });
      });

            
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['aapl', 'goog']})
        .end(function(err, res){
          let stockData = res.body['stockData']
          assert.isArray(stockData)
          /* Stocks can come in either order */
       
          done()
        });
      });
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['aapl', 'goog'], like: true})
        .end(function(err, res){
          let stockData = res.body.stockData
          assert.isArray(stockData)
          done()
        });
      });


});


