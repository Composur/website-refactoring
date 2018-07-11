var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var AuditTrailSchema = new Schema({
user: {type: Schema.Types.ObjectId, ref: 'User'},
executed_at: {type: Date, default: Date.now},
collection_name: {type: String},
object_id: {type: Schema.Types.ObjectId},
ip_address: {type: String},
message: {type: String}
});

AuditTrail = mongoose.model('AuditTrail', AuditTrailSchema);

/**
* @param {String} ip_address of the request
* @param {mongoose.Types.ObjectId | String} user_id
* @param {mongoose.model} record
* @param {String} message
*/
AuditTrail.addLog = function(ip_address, userId, record, message) {
AuditTrail.create({
    user: user_id,
    collection_name: record.collection.name,
    object_id: record._id,
    ip_address: ip_address,
    message: message
});
}

module.exports = AuditTrail;