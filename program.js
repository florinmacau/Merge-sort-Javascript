/*
 * Merge sort in Javascript
 * 
 * Florin Macau Alexandru 2014
 */

var fileInputId = "fileInput";
var readFileButtonId = "readFileButton";
var numberListId = "numberList";
var resetButtonId = "resetButton";
var numbersArray = [];
var step = 0;

/**
 * Reads the file with the id given as parameter
 * and puts the contents in fileContentsArray as an array of numbers
 * 
 * @param String fileInputId
 * @returns {undefined}
 */
function readFromFile(fileInputId) {
    var fileInput = document.getElementById(fileInputId);
    var file = fileInput.files[0];
    if (file.name !== "data.in") {
        alert("Please upload the data.in file");
        return;
    };
    if (file) {
        var reader    = new FileReader();
        reader.onload = function(e) {
            fileContents      = e.target.result;
            fileContentsArray = fileContents.split(new RegExp(/[\s \n]+/));
            document.getElementById("readFileButton").disabled = true;
            startAlgorithm(fileContentsArray);
        };
        reader.readAsText(file);
    } else {
        alert("The file is missing");
        return;
    };
};

/**
 * Merges the two sorted arrays, the first one that starts at firstPositionInFirstArray and finishes at lastPositionInFirstArray
 * and the second that starts at firstPositionInSecondArray and finishes at lastPositionInSecondArray, in one
 * sorted array starting at firstPositionInFirstArray and finishing at lastPositionInSecondArray
 * 
 * @param Number firstPositionInFirstArray
 * @param Number lastPositionInFirstArray
 * @param Number firstPositionInSecondArray
 * @param Number lastPositionInSecondArray
 */
function mergeSort(firstPositionInFirstArray, lastPositionInFirstArray, firstPositionInSecondArray, lastPositionInSecondArray)
{
    positionInFirstArray  = firstPositionInFirstArray;
    positionInSecondArray = firstPositionInSecondArray;
    sortedArray = [];
    
    //While neither from the two arrays has all elements in the merged array,
    //push the elements in ascending order in the merged array
    while (positionInFirstArray <= lastPositionInFirstArray && positionInSecondArray <= lastPositionInSecondArray) {
        if (parseInt(numbersArray[positionInFirstArray], 10) < parseInt(numbersArray[positionInSecondArray], 10)) {
            sortedArray.push(numbersArray[positionInFirstArray++]);
        } else {
            sortedArray.push(numbersArray[positionInSecondArray++]);
        };
    };
    
    var i;
    //If positionInFirstArray < lastPositionInFirstArray is true, it means that the second array was finished
    //and pushes the remaining elements into the merged array
    if (positionInFirstArray <= lastPositionInFirstArray) {
        for(i = positionInFirstArray; i <= lastPositionInFirstArray; i++) {
            sortedArray.push(numbersArray[i]);
        };
    } else { //It means that the second array was finished and pushes the remaining elements into the merged array
        for(i = positionInSecondArray; i <= lastPositionInSecondArray; i++) {
            sortedArray.push(numbersArray[i]);
        };
    };
    var j = 0;
    for(i = firstPositionInFirstArray; i <= lastPositionInSecondArray; i++) {
        numbersArray[i] = sortedArray[j++];
    };
};

/**
 * Creates the div element for the unique step given by parameter
 * 
 * @param Number step
 */
function createDivForStep(step) {
    var divElement = document.createElement("div");
    divElement.className = "row";
    divElement.innerHTML = "Step " + step.toString() + ": ";
    divElement.id = step.toString() + "Row";
    var brElement = document.createElement('br');
    divElement.appendChild(brElement);
    document.getElementById(numberListId).appendChild(divElement);
};

/**
 * Creates the span elements for the array elements
 * 
 * @param Number step
 */
function createSpansForDiv(step){
    var i;
    var arrayDimension = numbersArray.length;

    for(i = 0; i < arrayDimension; i++)
    {
        var element = document.createElement("span");
        element.innerHTML = numbersArray[i];
        element.className = "badge";
        element.id = step.toString() + "arrayElement" + i;
        document.getElementById(step.toString() + "Row").appendChild(element);
    };
}

/**
 * Colors the array that is going to be divided by divide et impera
 * 
 * @param Number step
 * @param Number firstPosition
 * @param Number middlePosition
 * @param Number lastPosition
 */
function colorElements(step, firstPosition, middlePosition, lastPosition){
    createSpansForDiv(step);
    
    var i;
    for(i = firstPosition; i <= middlePosition; i++) {
        document.getElementById(step.toString() + "arrayElement" + i).style.color = "black";
    }
    for(i = middlePosition + 1; i <= lastPosition; i++) {
        document.getElementById(step.toString() + "arrayElement" + i).style.color = "red";
    }
}

/**
 * Divides recursively the array that starts at firstPosition and finishes at lastPosition in two pieces
 * to merge always two ordered arrays
 * 
 * @param Number firstPosition
 * @param Number lastPosition
 */
function divideEtImpera(firstPosition, lastPosition)
{
    //If firstPosition and lastPosition are not the same,
    //apply divide et impera to merge the two arrays between firstPosition and lastPosition
    if (firstPosition !== lastPosition) {
        //Calculate the middle position between firstPosition and lastPosition to merge recursively the two arrays,
        //first one that starts at firstPosition and finishes at middlePosition
        //and second one that starts at middlePosition + 1 and finishes at lastPosition
        var middlePosition = Math.floor((firstPosition + lastPosition) / 2);
        
        //Creates div for actual step and color the elements that are being manipulated at this step
        createDivForStep(++step);
        colorElements(step, firstPosition, middlePosition, lastPosition);

        //Applies recursively divideEtImpera
        divideEtImpera(firstPosition, middlePosition);
        divideEtImpera(middlePosition + 1, lastPosition);
        //Sorts the two arrays
        mergeSort(firstPosition, middlePosition, middlePosition + 1, lastPosition);
    };
};

/**
 * Creates the elements array that are wanted to be ordered and starts the algorithm
 * 
 * @param Array fileContentsArray
 */
function startAlgorithm(fileContentsArray)
{  
    var arrayDimension = fileContentsArray[0];
    var i;

    //Creates the numberArray that is populated with the unordered elements given
    for(i = 1; i <= arrayDimension; i++)
    {
        numbersArray.push(fileContentsArray[i]);
    };

    //Creates the div element that contains the elements from the unordered array
    var divElement = document.createElement("div");
    divElement.className = "row";
    divElement.innerHTML = "Unordered array: ";
    divElement.id = step.toString() + "Row";
    var brElement = document.createElement('br');
    divElement.appendChild(brElement);
    document.getElementById(numberListId).appendChild(divElement);
    createSpansForDiv(step);

    //Starting the algorithm
    divideEtImpera(0, arrayDimension - 1);

    step++;
    //Creates the div element that contains the elements from the ordered array
    var divElement = document.createElement("div");
    divElement.className = "row";
    divElement.innerHTML = "Ordered array: ";
    divElement.id = step.toString() + "Row";
    var brElement = document.createElement('br');
    divElement.appendChild(brElement);
    document.getElementById(numberListId).appendChild(divElement);
    createSpansForDiv(step);
};

//Adds the "click" event to the #readFileButton
document.getElementById(readFileButtonId).addEventListener("click", function() {
                                            readFromFile(fileInputId);
                                         }, false);
//Adds the "click" event to the #resetButton
document.getElementById(resetButtonId).addEventListener("click", function() {
        document.getElementById(numberListId).innerHTML = "";
        document.getElementById("readFileButton").disabled = false;
        step = 0;
        numbersArray = [];
}, false);

