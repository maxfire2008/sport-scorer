"use strict";
/* example usage:
/  const data = {'type': 'race', 'name': 'Duathlon Short Course', 'distance': 'short_course', 'date': datetime.date(2023, 7, 1), 'results': {'donald_trump': {'finish_time': 3473430}, 'joe_biden': {'finish_time': 3382120}, 'kamala_harris': {'finish_time': 2537320}, 'hillary_clinton': {'finish_time': 2964450}, 'mitch_mcconnell': {'DNF': True}, 'nancy_pelosi': {'finish_time': 2172180}, 'bernie_sanders': {'finish_time': 9123850}, 'elizabeth_warren': {'finish_time': 2172180}}, '_filepath': '..\\sample_data\\results\\duathlon\\2023-07-duathlon-short.yaml', '_filename': '2023-07-duathlon-short.yaml'}
/  const athlete_list = {"bernie_sanders":{"_filename":"bernie_sanders.yaml","_filepath":"../sample_data/athletes/bernie_sanders.yaml","dob":"Mon, 08 Sep 1941 00:00:00 GMT","gender":"male","name":"Bernie Sanders","team":"blue"}, "kamala_harris":{"_filename":"kamala_harris.yaml","_filepath":"../sample_data/athletes/kamala_harris.yaml","dob":"Tue, 20 Oct 1964 00:00:00 GMT","gender":"female","name":"Kamala Harris","team":"blue"}}
/  const result_editor = new ResultEditor(data);
*/

localStorage.openpages = Date.now();
var onLocalStorageEvent = function (e) {
  if (e.key == "openpages") {
    // Listen if anybody else is opening the same page!
    localStorage.page_available = Date.now();
  }
  if (e.key == "page_available") {
    alert("Another Tally Ninja tab is open! Proceed with caution!");
  }
};
window.addEventListener("storage", onLocalStorageEvent, false);

let last_id = 0;

function new_id() {
  last_id += 1;
  return last_id;
}

function resolve(path, obj = self, separator = ".") {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return {
    get: function () {
      return properties.reduce((prev, curr) => prev && prev[curr], obj);
    },
    set: function (value) {
      properties.reduce((prev, curr, i, arr) => {
        if (i === arr.length - 1) {
          prev[curr] = value;
        }
        return prev[curr];
      }, obj);
    },
    delete: function () {
      properties.reduce((prev, curr, i, arr) => {
        if (i === arr.length - 1) {
          delete prev[curr];
        }
        return prev[curr];
      }, obj);
    },
  };
}

function millisecondsToHhmmss(milliseconds) {
  if (!Number.isInteger(milliseconds)) {
    throw new TypeError("milliseconds must be an integer");
  }

  const secondsTotal = milliseconds / 1000;
  const hours = Math.floor(secondsTotal / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = Math.floor(secondsTotal % 60);
  const decimalPart = (secondsTotal % 1).toFixed(3).substring(1);

  let output = "";

  if (hours > 0) {
    output += hours + ":";
  }
  if (minutes > 0) {
    output += minutes.toString().padStart(2, "0") + ":";
  }
  output += seconds.toString().padStart(2, "0");
  if (decimalPart > 0) {
    output += decimalPart;
  }

  return output;
}

function hhmmssToMilliseconds(hhmmss) {
  hhmmss = hhmmss.toString();

  if (hhmmss.split(".").length >= 2 && hhmmss.split(".")[1].length > 3) {
    throw new Error("More than 3 digits after the decimal point in " + hhmmss);
  }

  const hhmmssSplit = hhmmss.split(":");
  let seconds = parseFloat(hhmmssSplit[hhmmssSplit.length - 1]);

  if (hhmmssSplit.length > 1) {
    seconds += parseFloat(hhmmssSplit[hhmmssSplit.length - 2]) * 60;
  }
  if (hhmmssSplit.length > 2) {
    seconds += parseFloat(hhmmssSplit[hhmmssSplit.length - 3]) * 3600;
  }

  return Math.round(seconds * 1000);
}

function addInstruction(instruction) {
  const instructionLi = document.createElement("li");
  instructionLi.innerHTML = instruction;
  document.getElementById("instructions").appendChild(instructionLi);
}

class CompetitionEditor {
  constructor(data) {
    this.data = data;
    this.results = [];
    for (const key in data.results) {
      const r = new Result(key, data.results[key]);
      this.results.push(r);
      document.getElementById("tableBody").appendChild(r.DOMObject);
    }

    // this.appendColumn({ name: "Name", field: "name", type: "name_display" });

    if (this.data.type === "race") {
      this.appendColumn({
        name: "Finish Time",
        field: "finish_time",
        type: "duration",
      });
    } else if (this.data.type === "high_jump") {
      addInstruction(
        "Enter 'f' for failed attempts and 's' for successful attempts. " +
          "For example, 'ffs' would indicate two failed attempts then one successful attempt."
      );

      addInstruction(
        "If an athlete did not attempt a jump, leave the field blank."
      );

      addInstruction(
        "Only enter 3 attempts. If an athlete only attempted i.e., 2 jumps, only enter 2 characters."
      );

      let hj_columns = [];
      for (const key in data.results) {
        for (const height in data.results[key]["heights"]) {
          if (!hj_columns.includes(height)) {
            hj_columns.push(height);
          }
        }
      }
      hj_columns.sort();
      for (const column of hj_columns) {
        this.appendColumn({
          name: column + " mm",
          field: ["heights", column],
          type: "HighJumpAttemptsField",
        });
      }
    }

    for (const result of this.results) {
      result.appendColumn({
        name: "Remove",
        type: "remove_button",
        value: () => {
          delete this.data.results[result.athlete_id];
        },
      });
    }
  }
  appendColumn(column) {
    const tableHeaderRow = document.getElementById("tableHeaderRow");
    const th = document.createElement("th");
    th.innerHTML = column.name;
    tableHeaderRow.appendChild(th);

    for (const result of this.results) {
      console.log(column);
      result.appendColumn(column);
    }
  }
}

class Result {
  constructor(athlete_id, data) {
    this.athlete_id = athlete_id;
    this.data = data;
    this.DOMObject = document.createElement("tr");
  }
  appendColumn(column) {
    if (column.type === "HighJumpAttemptsField") {
      this.DOMObject.appendChild(
        new HighJumpAttemptsField(resolve(column.field, this.data)).DOMObject
      );
    }
  }
}

class HighJumpAttemptsField {
  constructor(value) {
    this.value = value;
    this.DOMObject = document.createElement("td");
    // convert false, false, true to ffs (failed, failed, success)
    const raw_value = this.value.get();
    if (raw_value !== undefined) {
      this.appendInputBox(raw_value);
    } else {
      this.appendCreateInputButton();
    }
  }

  appendCreateInputButton() {
    const createInputButton = document.createElement("button");
    createInputButton.innerHTML = "Create Input";
    createInputButton.onclick = (e) => {
      this.value.set([]);
      this.appendInputBox(this.value.get());
      e.target.remove();
    };
    this.DOMObject.appendChild(createInputButton);
  }

  appendInputBox(raw_value) {
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.value = raw_value.map((v) => (v ? "s" : "f")).join("");
    inputBox.onchange = (e) => {
      // validate the input is only f and s and a maximum of 3 characters
      if (
        (/^[fs]+$/.test(e.target.value) ||
          confirm(
            "The current field contains incorrect characters. Any characters other than 'f' and 's' will be treated as 'f'. Continue anyway?"
          )) &&
        (e.target.value.length <= 3 ||
          confirm(
            "The current field contains more than 3 characters. Continue anyway?"
          )) &&
        ((e.target.value.match(/s/g) || []).length <= 1 ||
          confirm(
            "The current field contains more than 1 successful attempt. Continue anyway?"
          )) &&
        (e.target.value[e.target.value.length - 1] === "s" ||
          !e.target.value.includes("s") ||
          confirm(
            "The current field contains an unsuccessful attempt as the last. Continue anyway?"
          ))
      ) {
        this.value.set(
          e.target.value.split("").map((v) => (v === "s" ? true : false))
        );
      } else {
        e.target.value = raw_value.map((v) => (v ? "s" : "f")).join("");
      }
    };
    this.DOMObject.appendChild(inputBox);
    const removeValueButton = document.createElement("button");
    removeValueButton.innerHTML = "Remove";
    removeValueButton.onclick = (e) => {
      this.value.delete();
      this.DOMObject.innerHTML = "";
      this.appendCreateInputButton();
    };
    this.DOMObject.appendChild(removeValueButton);
  }
}
