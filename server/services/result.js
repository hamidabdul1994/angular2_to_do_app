
var result;

function Result(status,message,data){
    this.status = status || true;
    this.message = message || "";
    this.data = data || {};
}

Result.prototype.setStatus = function(status){
    this.status = status;
}

Result.prototype.getStatus = function(){
    return this.status;
}

Result.prototype.setMessage = function(message){
    this.message = message;
}

Result.prototype.getMessage = function(){
    return this.message;
}

Result.prototype.setData = function(data){
    this.data = data;
}

Result.prototype.getData = function(){
    return this.data;
}

//For singleton
if(!(result instanceof Result)){
    result = new Result();
}

module.exports = result;