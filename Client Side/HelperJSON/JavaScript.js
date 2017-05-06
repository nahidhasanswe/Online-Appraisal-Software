var data = [{
    "id": 1,
    "Title": "Donec ut mauris eget massa tempor convallis.",
    "Weight": 20,
    "SelfAppraisal": 5,
    "PerformanceAppraisal": 2,
    "Score": 25
}, {
    "id": 2,
    "Title": "Pellentesque eget nunc.",
    "Weight": 10,
    "SelfAppraisal": 1,
    "PerformanceAppraisal": 2,
    "Score": 20
}, {
    "id": 3,
    "Title": "Suspendisse accumsan tortor quis turpis.",
    "Weight": 25,
    "SelfAppraisal": 3,
    "PerformanceAppraisal": 4,
    "Score": 20
}, {
    "id": 4,
    "Title": "Nulla justo.",
    "Weight": 40,
    "SelfAppraisal": 2,
    "PerformanceAppraisal": 3,
    "Score": 15
}, {
    "id": 5,
    "Title": "Phasellus sit amet erat.",
    "Weight": 20,
    "SelfAppraisal": 5,
    "PerformanceAppraisal": 4,
    "Score": 30
}, {
    "id": 6,
    "Title": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
    "Weight": 20,
    "SelfAppraisal": 4,
    "PerformanceAppraisal": 5,
    "Score": 25
}, {
    "id": 7,
    "Title": "In quis justo.",
    "Weight": 30,
    "SelfAppraisal": 1,
    "PerformanceAppraisal": 4,
    "Score": 10
}, {
    "id": 8,
    "Title": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
    "Weight": 10,
    "SelfAppraisal": 4,
    "PerformanceAppraisal": 5,
    "Score": 10
}, {
    "id": 9,
    "Title": "Nunc rhoncus dui vel sem.",
    "Weight": 35,
    "SelfAppraisal": 2,
    "PerformanceAppraisal": 3,
    "Score": 30
}, {
    "id": 10,
    "Title": "Maecenas tincidunt lacus at velit.",
    "Weight": 40,
    "SelfAppraisal": 5,
    "PerformanceAppraisal": 4,
    "Score": 40
}];

var dataRow = [];
var dataCol = { text: '', style: '' };

data.forEach(function (row) {
    dataCol.text = row.id;
    dataRow.push(dataCol);
    dataCol.text = row.Title;
    dataRow.push(dataCol);
    dataCol.text = row.Weight;
    dataRow.push(dataCol);
    dataCol.text = row.SelfAppraisal;
    dataRow.push(dataCol);
    dataCol.text = row.PerformanceAppraisal;
    dataRow.push(dataCol);
    dataCol.text = row.Score;
    dataRow.push(dataCol);
})

alert(dataRow[0].text);