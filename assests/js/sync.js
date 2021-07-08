const { ipcRenderer } = require("electron");

const setting = document.getElementById("setting");
const saveSettingBtn = document.querySelector("#save_setting");

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("settingsLoaded");
});

ipcRenderer.on("settingsResultSent", (e, settings) => {
  var settingContent;
  var baseURL = "https://restaurant.bdtask.com/demo/";
  settings.forEach((setting) => {
    console.log(setting);
    settingContent = `<div class="col-md-6">
        <div class="mb-2">
            <label for="title">App title</label>
            <input class="setting_input" type="text" value="${setting.title}" id="title" name="title" disabled>
        </div>
        <div class="mb-2">
            <label for="name">Restaurant name</label>
            <input class="setting_input" type="text" value="${setting.storename}" id="name" name="name" disabled>
        </div>
        <div class="mb-2">
            <label for="opening_time">Opening time</label>
            <input class="setting_input" type="text" value="${setting.opentime}" id="opening_time" name="opening_time" disabled>
        </div>
        <div class="mb-2">
            <label for="closing_time">Closing time</label>
            <input class="setting_input" type="text" value="${setting.closetime}" id="closing_time" name="closing_time" disabled>
        </div>
        <div class="mb-2">
            <label for="address">Address</label>
            <input class="setting_input" type="text" value="${setting.address}" id="address" name="address" disabled>
        </div>
        <div class="mb-2">
            <label for="email">Email address </label>
            <input class="setting_input"  type="text" value="${setting.email}" id="email" name="email" disabled>
        </div>

        <div class="mb-2">
            <label for="mobile">Mobile</label>
            <input class="setting_input" type="text" value="${setting.phone}" id="mobile" name="mobile" disabled>
        </div>
        <div class="mb-2">
            <label for="currency">Currency</label>
            <input class="setting_input" type="text" value="${setting.currencyname}" id="currency" name="currency" disabled>
        </div>
        <div class="mb-2">
            <label for="pagination">Max pagination</label>
            <input class="setting_input" type="number" value="${setting.max_page_per_sheet}" id="pagination" name="pagination">
        </div>
        <div class="mb-2">
            <label for="rows_per_page">Max rows per page</label>
            <input class="setting_input" type="number" value="${setting.row_per_page}" id="rows_per_page" name="rows_per_page">
        </div>
        <div class="mb-2">
            <label for="sync_delay">Order sync delay</label>
            <input class="setting_input"  type="time" value="${setting.sync_short_delay}" id="sync_delay" name="sync_delay" disabled>
        </div>

    </div>
    <div class="col-md-6">         
        <div class="mb-2">
            <label for="date_format">Date format</label>
            <input class="setting_input" type="text" value="${setting.dateformat}" id="date_format" name="date_format" disabled>
        </div>
        <div class="mb-2">
            <label for="allignment">Application alignment</label>
            <input class="setting_input" type="text" value="${setting.site_align}" id="allignment" name="allignment" disabled>
        </div>
        <div class="mb-2">
            <label for="discount_type">Discount type</label>
            <input class="setting_input" type="text" value="${setting.discount_type}" id="discount_type" name="discount_type" disabled>
        </div>

        <div class="mb-2">
            <label for="Service_charge">Service charge type</label>
            <input class="setting_input" type="text" value="${setting.service_chargeType}" id="Service_charge" name="Service_charge" disabled>
        </div>
        <div class="mb-2">
            <label for="vat">Vat setting</label>
            <input class="setting_input" type="text" value="${setting.vat}" id="vat" name="vat" disabled>
        </div>
        <div class="mb-2">
            <label for="delivery_time">Min delivery time</label>
            <input class="setting_input" type="text" value="${setting.min_prepare_time}" id="delivery_time" name="delivery_time" disabled>
        </div>
        <div class="mb-2">
            <label for="powered_by">Powered by text</label>
            <input class="setting_input" type="text" value="${setting.powerbytxt}" id="powered_by" name="powered_by" disabled>
        </div>
        <div class="mb-2">
            <label for="footer_text">Footer text</label>
            <input class="setting_input" type="text" value="${setting.footer_text}" id="footer_text" name="footer_text" disabled>
        </div>
        <div class="mb-2">
            <label for="language">Language</label>
            <input class="setting_input" type="text" value="${setting.language}" id="language" name="language">
        </div>
        <div class="mb-2">
            <label for="stock_validation">Stock valition</label>
            <select id="stock_validation" style="width:55%">
                <option>Active</option>
                <option>Inactive</option>
            </select>
        </div>
        <div class="mb-2">
            <label for="update_delay">Changed order update delay</label>
            <input class="setting_input" type="time" value="${setting.sync_long_delay}" id="update_delay" name="update_delay" disabled>
        </div>

    </div>
    <div class="row">

            <div class="settin_footer">
                <div class="d-flex justify-content-start">
                    <img src="${setting.logo}"
                        style="margin-right:300px;">

                    <img src="${baseURL}${setting.logo}">

                </div>
                <div class="d-flex justify-content-end">
                    <input style="margin-right:200px;width:123px;height:33px;text-align:center;" type="button"
                        id="reset_setting" class="btn btn-primary" name=" reset_setting" value="Reset">
                    <input style="margin-right:200px;width:123px;height:33px;text-align:center" type="button"
                        id="save_setting" class="btn btn-success" name=" save_setting" value="Save">
                </div>

            </div>
        </div>
        
    `;
  });
  setting.innerHTML = settingContent;
});
