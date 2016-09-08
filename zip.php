<?php
if(isset($_POST)&&count($_POST) > 0)
{
	$files = array();
	foreach($_POST as $location){
		$files[] = $location;
	}

	$valid_files = array();
	if(is_array($files)) {
		foreach($files as $file) {
			if(file_exists($file)) {
				$valid_files[] = $file;
			}
		}
	}

	$nameZip = preg_split("/\/|(\.|_)/",$valid_files[0]);

	if(count($valid_files) > 0){
		chmod('zips', 0777);
		$zip = new ZipArchive();
		$zip_name = (string) ''.$nameZip[1].'_'.date('Y-m-d-H-i-s').'.zip';
	
		if($zip->open('zips/'.$zip_name, ZipArchive::CREATE) !== true ){
			$error .= "* Sorry ZIP creation failed at this time";
		}
	
		foreach($valid_files as $file){
			$new_filename = substr($file,strrpos($file,'/') + 1);
			$zip->addFile($file, $new_filename);
		}
		$zip->addFile('readme.txt');
		$zip->addFile('ReadMe_Figures_and_Images.pdf');
	
		$zip->close();
		
		if(file_exists('zips/'.$zip_name)){
	
			header("Pragma: public");
			header("Expires: 0");
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			header("Cache-Control: private",false);
			header('Content-Type: application/zip');
			header('Content-disposition: attachment; filename='.$zip_name);
			header('Content-Length: ' . filesize('zips/'.$zip_name));
			readfile('zips/'.$zip_name);
	
			unlink('zips/'.$zip_name);
			if( chmod('zips', 0777) ) {
					// more code
					chmod('zips', 0755);
				}
			exit();
		}
		
	
	} else {
		echo "No valid files to zip";
		exit;
	}
}else{
	echo "Nothing was sent to zip up and give to you.";
}
?>
