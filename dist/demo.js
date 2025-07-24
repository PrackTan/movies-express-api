"use strict";
AutoCompleteTextView;
autoCompleteTextViewCountry = findViewById(R.id.autoCompleteTextViewCountry);
Spinner;
spinnerCountry = findViewById(R.id.spinnerCountry);
ArrayAdapter < String > adapter;
new ArrayAdapter(this, android.R.layout.simple_spinner_item, countryList);
autoCompleteTextViewCountry.setAdapter(adapter);
autoCompleteTextViewCountry.setOnItemClickListener(new AdapterView.OnItemClickListener(), {}, , void onItemClick(AdapterView <  ?  > parent : , View, view, int, position, long, id), {
    autoCompleteTextViewCountry, : .setVisibility(View.GONE),
    spinnerCountry, : .setVisibility(View.VISIBLE)
});
spinnerCountry.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener(), {}, , void onItemSelected(AdapterView <  ?  > parent : , View, view, int, position, long, id), {
    // Xử lý khi chọn giá trị từ Spinner
    String, selectedCountry = (String), parent, : .getItemAtPosition(position),
    // TODO: Xử lý khi chọn quốc gia
    Log, : .d("COUNTRY", "Selected Country: " + selectedCountry)
}, , void onNothingSelected(AdapterView <  ?  > parent : ), {
// Không làm gì khi không chọn gì
});
