var queries = [];


exports.getQueries = (text) => {

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
      })
      
    var kq;
    pool.connect((err, client, done)=>{
        if (err) {
        console.log(err);  
        }

        client.query(text, (err, kq) => {
        done();
        if (err) {
            console.log(err);
        }else
        queries = kq.rows.map((value) => {
            var value2 = value
            return value2;
        })
        })
    })
    console.log(queries.length);
    return queries;
    //}
};