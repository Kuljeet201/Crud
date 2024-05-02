
$(document).ready(function () {

        // read data

        $.get('index.json', function (res) {
                res.map(function (item, i) {
                        $('tbody').append(`<tr data-id='${item.id}'>
                                <td>${item.id}</td>
                                <td class="fd">${item.Name}</td>
                                <td class="fd">${item.Phone}</td>
                                <td class="fd">${item.Email}</td>
                                <td class="fd edit edit_department">${item.Department}</td>
                                <td class="fd">${item.Age}</td>
                                <td class="fd edit edit_work">${item.Work}</td>
                                <td class="fd edit edit_experience">${item.Experience}</td>
                                <td class="fd" style="text-transform:capitalize;">${item.Education}</td>
                                <td class="fd " style="text-transform:capitalize;">${item.Address}</td>
                                <td><button class="edit_btn">Edit</button><button class="save_btn">Save</button> <button class="del_btn">Delete</button></td>
                                </tr>`)
                })
        })

        // delete data

        $('section').on('click', '.del_btn', function () {
                const row = $(this).closest('tr');
                const idToDelete = row.data('id');

                Swal.fire({
                        title: 'Are you sure?',
                        text: 'Do you want to delete this row?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, save it!'
                }).then((result) => {
                        if (result.isConfirmed) {
                                Swal.fire({
                                        title: "Data Delete!",
                                        text: "Changes saved successfully!",
                                        icon: "success"
                                });

                                $.ajax({
                                        url: `http://localhost:3000/delete_form_data/${idToDelete}`,
                                        method: 'DELETE',
                                        success: function () {
                                                console.log('Alert Data is Delete');
                                                // row.remove()
                                        },
                                        error: function (xhr, status, error) {
                                                console.error("Error during delete request:", error); // Handle errors
                                        }
                                })
                        }
                });
        });



        // edit table
        $('section').on('click', '.edit_btn', function () {
                let tr = $(this).closest('tr');
                tr.find('.edit').each(function () {
                        let td = $(this);
                        let td_text = $(td).text();

                        if (!$(td).find('input').length) {
                                $(td).html(`<input class="edit_input" type="text" value="${td_text}" />`)
                        }

                })
        })

        // update data

        $('section').on('click', '.save_btn', function () {
                const row = $(this).closest('tr');
                const id = row.data('id');

                const updatedData = {
                        Department: row.find('.edit_department input.edit_input').val(),
                        Work: row.find('.edit_work input.edit_input').val(),
                        Experience: row.find('.edit_experience input.edit_input').val(),
                        // Add more fields as needed
                };

                // Send PUT request to update data
                $.ajax({
                        url: `http://localhost:3000/update_form_data/${id}`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(updatedData),
                        success: function (res) {
                                console.log('Data updated successfully');
                                // Reload data from JSON file and update table
                                $.get('./index.json', function (data) {
                                        renderTable(data);
                                });
                        },
                        error: function (xhr, status, error) {
                                console.error('Error updating data:', error);
                        }
                });
        });


})