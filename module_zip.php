<?php

if (isset($_GET['mod'])){
    $mod = $_GET['mod'];

    $path = 'asset/'.$mod;
        //echo $path."<br/>";
        //echo is_dir($path)."<br/>";
        if (is_dir($path)) {
            //code to use if directory
            $filenames = array_diff(scandir($path), array('..', '.'));
            //print_r( $filenames);
            //echo "<br/>count of files : ".count($filenames)."<br/>";
            if(count($filenames) > 0)
            {
                $files = array();
                foreach($filenames as $location){
                    $files[] = $path.'/'.$location;
                }
                //echo "<h1>Files</h1>";
                //print_r( $files);
                $valid_files = array();
                if(is_array($files)) {
                    foreach($files as $file) {
                        if(file_exists($file)) {
                        // echo "<br/>This file is real  : ".$file." filesize : ".filesize($file)."<br/>";
                            $valid_files[] = $file;
                        }
                    }
                }
                //echo "<h1>Valid Files</h1>";
                //print_r($valid_files);
                //echo "<br/>name of ZIP file : ".$mod ."<br/>";
                //echo "<br/>count of valid files : ".count($valid_files)."<br/>";
                if(count($valid_files) > 0){
                 //echo "<h1>Build the ZIP</h1>";
                    $zip = new ZipArchive();
                    $zip_name = (string) ''.$mod.'_'.date('Y-m-d-H-i-s').'.zip';
                    //echo "<br/>name of ZIP file : ".$zip_name ."<br/>";
                
                    if($zip->open('zips/'.$zip_name, ZipArchive::CREATE) !== true ){
                        $error .= "* Sorry ZIP creation failed at this time";
                    }
                
                    foreach($valid_files as $file){
                        $new_filename = substr($file,strrpos($file,'/') + 1);
                        //echo "<br/>name of each file in zip : ".$new_filename ." location: ".$file."<br/>";
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
                        exit();
                    }

                } else {
                    echo "No valid files to zip";
                    exit;
                }
            }else{
                echo "Nothing was sent to zip up and give to you.";
            }

        }

}
?>