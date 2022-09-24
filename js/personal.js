$(document).ready(function(){
    // save settings
    var readerSettings = {
        save : function() {
            var data = {
                    epub_enable: document.getElementById('epub_enable').checked ? 'true' : 'false',
                    pdf_enable: document.getElementById('pdf_enable').checked ? 'true' : 'false',
                    cbx_enable: document.getElementById('cbx_enable').checked ? 'true' : 'false'
            };

            OC.msg.startSaving('#reader-personal .msg');
            $.post(OC.filePath('files_reader', 'lib', 'personal-back.php'), data, readerSettings.afterSave);
        },
        afterSave : function(data){
            OC.msg.finishedSaving('#reader-personal .msg', data);
        }
    };
    $('#epub_enable').on("change", readerSettings.save);
    $('#pdf_enable').on("change", readerSettings.save);
    $('#cbx_enable').on("change", readerSettings.save);
});

