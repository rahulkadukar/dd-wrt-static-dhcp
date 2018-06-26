$(document).ready(function(){
  let finalData = [];
  $('#routerScript').hide();
  $('#errMessage').hide();

  $('#addRow').click(function(){
    let newRow = '<tr>';
    for (let x = 0; x < 4; ++x) {
      newRow += '<td contenteditable="true" max-width="200px"></td>';
    }
    newRow += '</tr>';
    $('#outputRows').append(newRow);
  })

  $('#nvramString').change(function() {
    let routerData = [];

    let rawData = $('#nvramString').val();
    let machineData = rawData.split(' ');
    for (let x in machineData) {
      let rawDHCPData = machineData[x].split('=');
      let rowData = {};
      rowData.mac = rawDHCPData[0];
      rowData.name = rawDHCPData[1];
      rowData.ip = rawDHCPData[2];
      rowData.dur = rawDHCPData[3] ? parseInt(rawDHCPData[3]) : 0;
      routerData.push(rowData);
    }

    $('#outputRows').empty();
    let outputContents = '';

    for (let x in routerData) {
      let newRow = '<tr>';
      newRow += '<td contenteditable="true">' + routerData[x].mac + '</td>';
      newRow += '<td contenteditable="true">' + routerData[x].name + '</td>';
      newRow += '<td contenteditable="true">' + routerData[x].ip + '</td>';
      newRow += '<td contenteditable="true">' + routerData[x].dur + '</td>';
      newRow += '</tr>';

      outputContents += newRow;
    }

    $('#outputRows').append(outputContents);
  })

  $('#generate').click(function() {
    $('#errMessage').html('');
    $('#errMessage').hide();
    let allData = [];

    $('#outputTable > tbody > tr').each(function() {
      $(this).children('td').each(function(){
        let data = $(this).html();
        allData.push(data);
      })
    });

    let finalData = [];

    if (allData.length === 0) {
      $('#errMessage').html('<p>Enter some data into the table before clicking Generate</p>');
      $('#errMessage').show();
      return;
    }

    for (let x = 0; x < allData.length;) {
      let rowData = {};
      rowData.mac = allData[x];
      rowData.name = allData[x + 1];
      rowData.ip = allData[x + 2];
      rowData.dur = allData[x + 3];

      if (rowData.mac.length < 1) {
        $('#errMessage').html('<p>MAC address field cannot be blank</p>');
        $('#errMessage').show();
        return;
      }

      if (rowData.name.length < 1) {
        $('#errMessage').html('<p>Name of machine cannot be blank</p>');
        $('#errMessage').show();
        return;
      }

      if (rowData.ip.length < 1) {
        $('#errMessage').html('<p>IP address field cannot be blank</p>');
        $('#errMessage').show();
        return;
      }

      finalData.push(rowData);
      x += 4;
    }

    let routerString = 'nvram set static_leases="';
    
    for (let x in finalData) {
      let rd = finalData[x];
      routerString += rd.mac + '=' + rd.name + '=' + rd.ip + '=' + (rd.dur == 0 ? ' ' : rd.dur + ' ')
    }

    routerString += '"';
    routerString += '\nnvram set static_leasenum=' + finalData.length;
    routerString += '\nnvram commit';
    $('#routerScript').text(routerString);
    $('#routerScript').show();
  })
});