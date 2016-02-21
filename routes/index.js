exports.listSysTables = function(ibmdb,connString) {
		console.log('connectionString: ' + connString);
    return function(req, res) {

	   	   
       ibmdb.open(connString, function(err, conn) {
    	   
    	   console.log('connectionString: ' + conn);
    	   
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("SELECT FIRST_NAME, LAST_NAME, EMAIL, WORK_PHONE from GOSALESHR.employee FETCH FIRST 20 ROWS ONLY", function(err, tables, moreResultSets) {
							
							
				if ( !err ) { 
					res.render('tablelist', {
						"tablelist" : tables,
						"tableName" : "10 Rows From the GOSALESHR.EMPLOYEE Table"
						
					 });

					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}