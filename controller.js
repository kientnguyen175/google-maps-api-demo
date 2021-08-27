let autocomplete;
let shipAddressField;
// quốc gia mặc định
let defaultCountry = 'US';
// liệt kê các nước có states
let federalNations = ['US', 'CA'];
// liệt kê các nước không có states
let nationsOutOfFederalSystem = ['DE', 'VN', 'AU', 'UK', 'JP'];

// khởi tạo autocomplete
function initAutocomplete() {
    shipAddressField = document.querySelector('#shipAddress');
    autocomplete = new google.maps.places.Autocomplete(shipAddressField, {
        componentRestrictions: { country: defaultCountry },
        fields: ['address_components', 'geometry'],
        types: ['address']
    });
    shipAddressField.focus();
    autocomplete.addListener('place_changed', fillInAddress);
}

// bắt sự kiện thay đổi quốc gia
$(document).on('change', '#country', function() {
    var countryCode = $(this).val();
    updateAutocomplete(countryCode);
});

// xử lý kết quả và cập nhật dữ liệu các ô input
function fillInAddress() {
    const place = autocomplete.getPlace();
    console.log(place);
    document.querySelector('#city').value = '';
    let streetAddress = '';
    let zipCode = '';
    for (const component of place.address_components) {
        switch (component.types[0]) {
            case 'street_number':
                streetAddress = `${component.long_name} ${streetAddress}`;
                break;
            case 'route':
                streetAddress += component.long_name;
                break;
            case 'postal_code':
                zipCode = `${component.long_name}${zipCode}`;
                break;
            case 'postal_code_suffix':
                zipCode = `${zipCode}-${component.long_name}`;
                break;
            case 'postal_code_prefix':
                zipCode = `${component.long_name}-${zipCode}`;
                break;
            case 'locality':
                document.querySelector('#city').value = component.long_name;
                break;
            case 'postal_town':
                document.querySelector('#city').value = component.long_name;
                break;
            case 'administrative_area_level_1':
                doWithFederalNations(document.querySelector('#country').value, component.long_name);
                break;
        }
    }
    shipAddressField.value = '';
    document.querySelector("#streetAddress").value = streetAddress;
    console.log(zipCode);
    if (zipCode[0] != '-' && zipCode[-1] != '-') {
         document.querySelector("#zipCode").value = zipCode;
    }
}

// cập nhật quốc gia
function updateAutocomplete(countryCode) {
    var options = {
        componentRestrictions: { country: countryCode }
    };
    if (autocomplete) {
        autocomplete.setOptions(options);
        if (document.querySelector('#state')) document.querySelector('#state').value = '';
        document.querySelector('#city').value = '';
        document.querySelector('#streetAddress').value = '';
        document.querySelector('#zipCode').value = '';
    }
}

// xử lý state và city ở mỗi quốc gia khác nhau
function doWithFederalNations(shortNameOfCountry, administrativeAreaLevel1) {
    if (federalNations.includes(shortNameOfCountry) && document.querySelector('#state')) {
        document.querySelector('#state').value = administrativeAreaLevel1;
    } else {
        if (!document.querySelector("#city").value) document.querySelector("#city").value = administrativeAreaLevel1;
    }
}