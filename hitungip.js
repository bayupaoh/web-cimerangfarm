var waktu_panen = new Array(); 


var populasi_awal = 5000; //ekor
var populasi_akhir = 4850; //ekor
var umur_panen = 28; // Hari
var berat_panen_total = 6776.4; // kg
var total_jml_pakan = 9400; //kg
var beratdoc = 0.04; //Kg /ekor 
var ayam_mati = 65; //ekor 
var ayam_afkir = 85; //ekor 

waktu_panen.push({hari:21,jumlah:520,berat:0.82});
waktu_panen.push({hari:28,jumlah:3850,berat:1.4});
waktu_panen.push({hari:35,jumlah:480,berat:2});

//Berat rata-rata
function hitung_bobot_badan(berat){
    var berat_bobot =0; 
    var jumlah_ayam =0; 
    for(i=0;i<berat.length;i++){
        berat_bobot += berat[i].jumlah * berat[i].berat;
        jumlah_ayam += berat[i].jumlah;
    }
    return (berat_bobot / jumlah_ayam).toFixed(2);
}

// hitung deplesi
function hitung_deplesi1(mati,afkir,populasi){
    return ((mati+afkir)/populasi)*100;
}

function hitung_deplesi2(populasi,panen){
    return ((populasi-panen))/(populasi)*100;
}

function hitung_fcr(jumlah_pakan,panen,berat_doc,populasi_awal){
    var berat_ayam =0; 
    for(var i=0;i<panen.length;i++){
        berat_ayam += panen[i].jumlah * panen[i].berat;
    }
    return(jumlah_pakan/(berat_ayam-(berat_doc * populasi_awal))).toFixed(2);
}


//hitung umur rata-rata panen A/U 
function hitung_rata_panen(panen,populasi_akhir){
    var total_hari = 0; 
    for(var i=0;i<panen.length;i++){
        total_hari += panen[i].hari * panen[i].jumlah; 
        
    }
    return (total_hari/populasi_akhir).toFixed(2);
}

//hitung IP 
function hitung_ip(delasi,berat_rata,fcr,rata_panen){
    return ((100-delasi) * berat_rata/(fcr*rata_panen)*100).toFixed(2);
}
//console.log(hitung_deplesi1(65,85,5000));
//console.log(waktu_panen[0].hari);
//console.log(hitung_bobot_badan(waktu_panen));

var delasi = hitung_deplesi1(ayam_mati,ayam_afkir,populasi_awal);
var bobot_rata = hitung_bobot_badan(waktu_panen);
var fcr = hitung_fcr(total_jml_pakan,waktu_panen,beratdoc,populasi_awal);
var rata_panen = hitung_rata_panen(waktu_panen,populasi_akhir);
var nilai_ip = hitung_ip(delasi,bobot_rata,fcr,rata_panen);
console.log('Delasi : '+delasi);
console.log('Bobot Rata : '+bobot_rata);
console.log('Nilai FCR : '+fcr);
console.log('NIlai IP : '+nilai_ip);