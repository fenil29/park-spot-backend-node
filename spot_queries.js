const { Pool, Client } = require('pg')
const validate= require('./validate.js');
const connectionString = 'postgresql://fms_admin:fmsadmin@localhost:5432/fms'
const pool = new Pool({
  connectionString: connectionString,
})

const client = new Client({
  connectionString: connectionString,
})

const getSD = (request, response) => {
  pool.query('SELECT * FROM fms_parking_spot ORDER BY lot_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSDById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM fms_parking_spot WHERE lot_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSDBystatus = (request, response) => {
  const status = request.params.status
  const id=request.params.id
  pool.query('SELECT * FROM fms_parking_spot WHERE sd_status = $1 AND lot_id=$2', [status,id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


// const createUser = (request, response) => {
//   const { id,email,fname,lname, mobile } = request.body

//   pool.query('INSERT INTO fms_user (user_user_id,user_email_id,user_first_name,user_last_name, user_mobile_no) VALUES($1, $2,$3,$4,$5)', [ id,email,fname,lname, mobile], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`User added with ID: ${result.insertId}`)
//   })
// }

const createSD = (request, response) => {
  console.log(request.body)
   const { no,lot } = request.body
    validate.create_spot_schema.validate({ jno:no,jno:lot });
    
     const temp=validate.create_spot_schema.validate({ jno:no,jno:lot });
     //console.log(temp.error)
     if(temp.error){
       response.status(201).send("Spot was not added. Invalid entry. Please try again.") 
     }
     else{
     for (let index = 1; index <= no; index++) {
      
      var text = 'INSERT INTO fms_parking_spot (spot_no,sd_status,lot_id) VALUES($1, $2,$3)'
      var values = [index,0,lot]
      
      pool.query(text,values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          //console.log(res.rows[0])
          //response.status(201).send(`Spots added `)
          // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        }
      })
      }
           
 // callback
    
 }
 }

const updateSD = (request, response) => {
  const id = parseInt(request.params.id)
  const {status,spot } = request.body
  validate.create_spot_schema.validate({ jid: id, jstatus: status,jid:spot });
    
    const temp=validate.create_spot_schema.validate({ jid: id, jstatus: status,jid:spot });
    //console.log(temp.error)
    if(temp.error){
      response.status(201).send("Spot was not updated. Invalid entry. Please try again.") 
    }
    else{
  pool.query(
    'UPDATE fms_parking_spot SET sd_status= $1,lot_id=$3 WHERE spot_no = $2',
    [status,spot, id],
    (error, result) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Spot modified with ID: ${id}`)
    }
  )
}
}

const deleteSD = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM fms_parking_spot WHERE spot_no = $1', [id], (error, result) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Spot deleted with ID: ${id}`)
  })
}

module.exports = {
  getSD,
  getSDById,
  getSDBystatus,
  createSD,
  updateSD,
  deleteSD
}