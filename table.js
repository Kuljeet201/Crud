$(document).ready(function () {
        let table_data = [];

        // data search function

        $('#btn').click(function () {
                var userId = $('input[type="text"]').val();

                if (userId !== '') {
                        var userRow = $('td[value="' + userId + '"]').closest('tr');

                        var name = userRow.find('td:eq(1)').text();

                        var department = userRow.find('td:eq(2)').text();

                        $('#get_name').text('Name : ' + name);
                        $('#get_depart').text('Department : ' + department);
                }
                else if (userId == '') {
                        alert("Please Enter Your IDs")
                }

        });

        // remove function

        $('tbody').on('click', '.remove', function () {
                var row = $(this).closest('tr');
                row.remove();
        });

        // insert input when input is not in td

        $('tbody').on('click', '.edit', function (event) {
                if (!$(this).find('input').length) {
                        var inp = $(this).html('<input type="text" />');
                        inp.find('input').focus();
                }
        });

        // save edit data on dbclick or blur

        $('tbody').on('blur', 'input', function (event) {
                var newValue = $(this).val();
                var td = $(this).closest('.edit');
                td.text(newValue);
        });

        // insert with array of an Object

        $('#insert').on('click', function () {

                //  take empty object
                let newItem = {}

                // store value of input
                let inp_name = $('#set_name').val();
                let inp_depart = $('#set_depart').val();

                // add input value in object
                newItem.name = inp_name;
                newItem.department = inp_depart;

                // push object in tabel_data array
                table_data.push(newItem);

                // take condition for insert data to table row
                if (inp_name !== '' || inp_depart !== '') {
                        $('tbody').append(`<tr>
                                                <td value=${table_data.length}>${table_data.length}</td>
                                                <td class="edit">${inp_name}</td>
                                                <td class="edit">${inp_depart}</td>
                                                <td class="remove" title=${table_data.length} style="text-align:center;">&#10060;</td>
                                                </tr>`)

                        // after insert data into row input field empty
                        $('#set_name').val('');
                        $('#set_depart').val('');
                } else {
                        alert('Please Insert Data In Field')
                }
        })

        // insert into table

        // $('#insert').on('click', function () {
        //         let inp_name = $('#set_name').val();
        //         let inp_depart = $('#set_depart').val();


        //         // increment id
        //         id += 1;

        //         // append data when input is not empty

        //         if (inp_name !== '' || inp_depart !== '') {
        //                 $('tbody').append(`<tr>
        //                 <td value=${id}>${id}</td>
        //                 <td class="edit">${inp_name}</td>
        //                 <td class="edit">${inp_depart}</td>
        //                 <td title=${id} style="text-align:center;">&#10060;</td>
        //                 </tr>`)
        //                 $('#set_name').val('');
        //                 $('#set_depart').val('');
        //         }
        // })

});

