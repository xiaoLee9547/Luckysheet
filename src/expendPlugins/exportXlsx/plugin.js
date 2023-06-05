
import locale from '../../locale/locale';
import { modelHTML } from "../../controllers/constant";
import { replaceHtml } from '../../utils/util';
import tooltip from '../../global/tooltip';
import { getSheetIndex } from '../../methods/get';
import Store from '../../store';
import {exportSheetExcel} from "../../function/export_excel";
import {luckysheet} from "../../core";

// Initialize the export xlsx api
function exportXlsx(options, config, isDemo) {

}

function downloadXlsx(data, filename) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 *
 * @param {*} url
 * @param {*} success
 * @param {*} fail
 */
function fetchAndDownloadXlsx({url,order}, success, fail) {
    const luckyJson = luckysheet.toJson();
    luckysheet.getAllChartsBase64((chartMap) => {
        luckyJson.chartMap = chartMap
        luckyJson.devicePixelRatio = window.devicePixelRatio
        luckyJson.exportXlsx = {
            order
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(luckyJson)
        })
            .then((response) => response.blob())
            .then((blob) => {
                if (blob.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const filename = luckyJson.title + '.xlsx';
                    downloadXlsx(blob, filename);
                    success && success()
                } else {
                    fail && fail()
                }

            })
            .catch((error) => {
                console.error('fetch error:', error);
                fail && fail()
            });
    })


}

function createExportDialog() {
    $("#luckysheet-modal-dialog-mask").hide();
    const xlsxContainer = $("#luckysheet-export-xlsx");

    if (xlsxContainer.length === 0) {

        const _locale = locale();
        const locale_exportXlsx = _locale.exportXlsx;
        const locale_button = _locale.button;

        let content = `<div class="luckysheet-export-xlsx-content" style="padding: 10px 10px 10px 0;">
                <span>${locale_exportXlsx.fileName}</span>
                <input class="luckysheet-export-xlsx-filename" />
        </div>`;

        $("body").append(
            replaceHtml(modelHTML, {
                id: "luckysheet-export-xlsx",
                addclass: "luckysheet-export-xlsx",
                title: locale_exportXlsx.title,
                content: content,
                botton: `<button class="btn btn-primary luckysheet-model-confirm-btn">${locale_button.confirm}</button><button class="btn btn-default luckysheet-model-close-btn">${locale_button.close}</button>`,
                style: "z-index:16",
                close: locale_button.close,
            }),
        );

        // init event
        $("#luckysheet-export-xlsx .luckysheet-model-confirm-btn").on('click',()=>{
            const fileName = $('.luckysheet-export-xlsx-filename').val();
            if(!fileName){
                tooltip.info(locale_exportXlsx.fileNameEmpty, "");
            } else {
                $("#luckysheet-export-xlsx").hide()
                exportSheetExcel(luckysheet, fileName);
            }
        })
    }



    let $t = $("#luckysheet-export-xlsx").find(".luckysheet-modal-dialog-content").css("min-width", 350).end(),
        myh = $t.outerHeight(),
        myw = $t.outerWidth();
    let winw = $(window).width(),
        winh = $(window).height();
    let scrollLeft = $(document).scrollLeft(),
        scrollTop = $(document).scrollTop();
    $("#luckysheet-export-xlsx")
        .css({ left: (winw + scrollLeft - myw) / 2, top: (winh + scrollTop - myh) / 3 })
        .show();

}

export { exportXlsx, downloadXlsx, fetchAndDownloadXlsx, createExportDialog }
