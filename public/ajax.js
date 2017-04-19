document.addEventListener('DOMContentLoaded', init);
function init(){
	//Filter by a Term
	var searchBtn= document.getElementById("filterBtn").addEventListener('click', search);
};

function search(event){
	// Jquery request GET-->https://api.jquery.com/jquery.get/
	var priority = document.getElementsByName("priority")[0].value;
	if(priority => 1 && priority < 6){
		$.get("http://localhost:3000/api/bucketlist?priority=" + priority, function(data) {
			var newTable = document.getElementById("actualItems");
			while (newTable.firstChild) {
			 	newTable.removeChild(newTable.firstChild);
			}
		 	data.forEach(function(eachObj) {
				//Create Overall Row
				var row = document.createElement("tr");
				//Each Data Entry
				var title =  document.createElement("td");
				title.append(document.createTextNode(eachObj.title));
				row.append(title);
				var date =  document.createElement("td");
				date.append(document.createTextNode(eachObj.date));
				row.append(date);
				var description =  document.createElement("td");
				description.append(document.createTextNode(eachObj.description));
				row.append(description);

				var priority =  document.createElement("td");
				priority.append(document.createTextNode(eachObj.priority));
				row.append(priority);
				newTable.append(row);
			});
		});
	}//end of if
	else{
		alert("Please enter valid priority (between 1 and 5)");
	}
	
}





