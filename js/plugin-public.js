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
    const mimeHandlers = {
        'epub': { default: epub_enabled, mimeTypes: ['application/epub+zip']},
        'pdf': { default: pdf_enabled, mimeTypes: ['application/pdf']},
        'cbx': { default: cbx_enabled, mimeTypes: [
            'application/comicbook+7z',
            'application/comicbook+rar',
            'application/comicbook+tar',
            'application/comicbook+zip',
            'application/x-cbr'
        ]}
    };

    const mimeMappings = {
        'application/epub+zip': 'epub',
        'application/pdf': 'pdf',
        'application/x-cbr': 'cbx',
        'application/comicbook+7z': 'cbx',
        'application/comicbook+rar': 'cbx',
        'application/comicbook+tar': 'cbx',
        'application/comicbook+zip': 'cbx'
    };

    const isMobileUAD = window.navigator.userAgentData?.mobile;
    const isMobile = typeof isMobileUAD === 'boolean'
        ? isMobileUAD
        : navigator.userAgent.match(/Mobi/i);

    function actionHandler(fileName, mime, context) {
        const downloadUrl = Files.getDownloadUrl(fileName, context.dir);
        OCA.Files_Reader.Plugin.show(downloadUrl, mimeMappings[mime], true);
    }



    /**
     * @namespace OCA.Files_Reader.Plugin
     */
    OCA.Files_Reader.Plugin = {

        /**
         * @param mimeType
         */
        getMapping: function(mimeType) {
            return mimeMappings[mimeType];
        },

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
        show: function(downloadUrl, fileType, isFileList) {
            var self = this;
            var $iframe;
            var viewer = OC.generateUrl('/apps/files_reader/?file={file}&type={type}', {file: downloadUrl, type: fileType});
            // launch in new window on mobile devices...
            if (isMobile) {
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
            for (handler in mimeHandlers) {
                const actionName = 'view-' + handler;
                mimeHandlers[handler].mimeTypes.forEach(function(mimeType) {
                    fileActions.registerAction({
                        name: actionName,
                        displayName: 'View',
                        mime: mimeType,
                        permissions: OC.PERMISSION_READ,
                        actionHandler: function(fileName, context){
                            return actionHandler(fileName, mimeType, context);
                        }
                    });

                    if (mimeHandlers[handler].default === 'true')
                        fileActions.setDefault(mimeType, actionName);
                });
            }
        }
    };

})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.Files_Reader.Plugin);

// FIXME: Hack for single public file view since it is not attached to the fileslist
$(document).ready(function(){
    const viewer = OCA.Files_Reader.Plugin;
    const fileType=viewer.getMapping($('#mimetype').val());
    if ($('#isPublic').val() && fileType) {
        const sharingToken = $('#sharingToken').val();
        const downloadUrl = OC.generateUrl('/s/{token}/download', {token: sharingToken});
        viewer.show(downloadUrl, fileType, false);
    }
});
