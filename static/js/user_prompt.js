// Because the example already has a dummy table entry as #1
// the first element inserted by our code should be #2
var startCnt = 2;
var delimChar = '|'; // The default delimiter character is '|'

function initFunc()
{
    // This function call sets the submit handler
    // to the function 'userSubmit'

    // When the form with ID "userForm" is submitted
    // the function userSubmit() is called instead
    $("#userForm").submit(userSubmit);
}

function userSubmit()
{
    // This function simply sends a POST request
    // to the URL '/givename'.

    // This post request sends a single parameter named 'name'
    // The value of this parameter is the value held in
    // the element with ID "nameBox"

    // If the POST request succeeds, then tableEntryAdd()
    // is called
    $.post("/givename",
	   {
	       name: $("#nameBox").val()
	   }, tableEntryAdd, 'text');
    return false;
}

function tableEntryAdd(data)
{
    // If the response is not an error then we received data
    // of the form 'name|timestamp'
    // Split the data along the '|' delimiter and then add
    // a table entry with those values.

    // A running counter called 'startCnt' keeps track of the entry number
    if (data != "error")
    {
	var splitData = data.split(delimChar); // Split the string
	$("#tableBody").append("<tr><td>"+startCnt+"</td><td>"+splitData[0]+"</td><td>"+splitData[1]+"</td></tr>"); // Add the HTML for the table entry
	$("#nameBox").val(''); // Clear the name box so we can enter another name
	startCnt++; // Increment our counter
    }
}

// Once the document is done loading, initFunc is executed
$(document).ready(initFunc);