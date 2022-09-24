/*
 * Copyright (c) 2015-2017 Frank de Lange
 * Copyright (c) 2013-2014 Lukas Reschke <lukas@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */


(function(OCA) {

    OCA.Files_Reader = OCA.Files_Reader || {};
    const epub_enabled = OCP.InitialState.loadState('files_reader', 'epub_enabled');
    const pdf_enabled = OCP.InitialState.loadState('files_reader', 'pdf_enabled');
    const cbx_enabled = OCP.InitialState.loadState('files_reader', 'cbx_enabled');

    /* comicbooks come in many different forms... */
    const cbx_types= [
        'application/comicbook+7z',
        'application/comicbook+rar',
        'application/comicbook+tar',
        'application/comicbook+zip',
        'application/x-cbr',
        ];
        

    var isMobile = navigator.userAgent.match(/Mobi/i);
    var hasTouch = 'ontouchstart' in document.documentElement;

    function actionHandler(fileName, mime, context) {
        var sharingToken = $('#sharingToken').val();
        var downloadUrl = OC.generateUrl('/s/{token}/download?files={files}&path={path}', {
            token: sharingToken,
            files: fileName,
            path:  context.dir
        });
        OCA.Files_Reader.Plugin.show(downloadUrl, mime, true);
    }

    /**
     * @namespace OCA.Files_Reader.Plugin
     */
    OCA.Files_Reader.Plugin = {

        /**
         * @param fileList
         */
        attach: function(fileList) {
            this._extendFileActions(fileList.fileActions);
        },

        hideControls: function() {
            $('#app-content #controls').hide();
            // and, for NC12...
            $('#app-navigation').css("display", "none");
            $('#view-toggle').css("display", "none");
        },

        hide: function() {
            if ($('#fileList').length) {
                FileList.setViewerMode(false);
            }
            $("#controls").show();
            $('#app-content #controls').removeClass('hidden');
            // NC12...
            $('#app-navigation').css("display", "");
            $('#view-toggle').css("display", "");
            $('#imgframe').show();
            $('footer').show();
            $('.directLink').show();
            $('.directDownload').show();
            $('iframe').remove();
        },

        /**
         * @param downloadUrl
         * @param isFileList
         */
        show: function(downloadUrl, mimeType, isFileList) {
            var self = this;
            var $iframe;
            var viewer = OC.generateUrl('/apps/files_reader/?file={file}&type={type}', {file: downloadUrl, type: mimeType});
            // launch in new window on mobile and touch devices...
            if (isMobile || hasTouch) {
                window.open(viewer, downloadUrl);
            } else {
                $iframe = '<iframe style="width:100%;height:100%;display:block;position:absolute;top:0;" src="' + viewer + '" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"  sandbox="allow-scripts allow-same-origin"/>';
                if (isFileList === true) {
                    FileList.setViewerMode(true);
                }
                // force the preview to adjust its height
                $('#preview').append($iframe).css({ height: '100%' });
                $('body').css({ height: '100%' });
                $('footer').addClass('hidden');
                $('#imgframe').addClass('hidden');
                $('.directLink').addClass('hidden');
                $('.directDownload').addClass('hidden');
                $('#controls').addClass('hidden');
            }
        },

        /**
         * @param fileActions
         * @private
         */
        _extendFileActions: function(fileActions) {
            var self = this;
            fileActions.registerAction({
                name: 'view-epub',
                displayName: 'View',
                mime: 'application/epub+zip',
                permissions: OC.PERMISSION_READ,
                actionHandler: function(fileName, context){
                    return actionHandler(fileName, 'application/epub+zip', context);
                }
            });
            for (let i = 0; i < cbx_types.length; i++) {
                fileActions.registerAction({
                    name: 'view-cbr',
                    displayName: 'View',
                    mime: cbx_types[i],
                    permissions: OC.PERMISSION_READ,
                    actionHandler: function(fileName, context) {
                        return actionHandler(fileName, 'application/x-cbr', context);
                    }
                });
            }
            fileActions.registerAction({
                name: 'view-pdf',
                displayName: 'View',
                mime: 'application/pdf',
                permissions: OC.PERMISSION_READ,
                actionHandler: function(fileName, context) {
                    return actionHandler(fileName, 'application/pdf', context);
                }
            });


            

            if (epub_enabled === 'true')
                fileActions.setDefault('application/epub+zip', 'view-epub');
            if (cbx_enabled === 'true') {
                for (let i = 0; i < cbx_types.length; i++) {
                    fileActions.setDefault(cbx_types[i], 'view-cbr');
                }
            }
            if (pdf_enabled === 'true')
                fileActions.setDefault('application/pdf', 'view-pdf');
        }
    };

})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.Files_Reader.Plugin);

// FIXME: Hack for single public file view since it is not attached to the fileslist
$(document).ready(function(){
    const mimetype=$('#mimetype').val();
    if ($('#isPublic').val()
        && (mimetype === 'application/epub+zip'
            || mimetype === 'application/pdf'
            || mimetype === 'application/x-cbr'
            || mimetype.startsWith('application/comicbook'))
    ) {
        var sharingToken = $('#sharingToken').val();
        var downloadUrl = OC.generateUrl('/s/{token}/download', {token: sharingToken});
        var viewer = OCA.Files_Reader.Plugin;
        var mime = $('#mimetype').val();
        if (mimetype.startsWith('application/comicbook'))
            mime = 'application/x-cbr';
        viewer.show(downloadUrl, mime, false);
    }
});
