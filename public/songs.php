<?
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function findImage($dir, $name, $imageExts) {
	foreach ($imageExts as $img_ext) {	
		$img = $dir.'/'.$name.'.'.$img_ext;
		if (file_exists($img)) {
			return $img;
		}
	}
    return null;
}


function findSongsInDir($dir, $songExts) {
	$songs = [];
	foreach (scandir($dir) as $song) {
		$basename = pathinfo($song, PATHINFO_FILENAME);
		$ext = pathinfo($song, PATHINFO_EXTENSION);

		if (in_array($ext, $songExts)) {
			array_push($songs, $dir.'/'.$song);
		}
	}
	return $songs;	
}

function findDirs($dir) {
	$dirs = [];
	foreach (scandir($dir) as $fname) {
		$dirPath = $dir.'/'.$fname;
		if (!in_array($fname, ['.', '..', '@eaDir'])  &&  
			 is_dir($dirPath)) {
			array_push($dirs, [
				'playlist' => $fname,
				'img' => findImage($dirPath, 'cover',  ['png', 'jpg', 'gif']),
				'songs' => findSongsInDir($dirPath, ['mp3', 'm4a'])
			]);
		}

	}
	return $dirs;
}


echo json_encode(findDirs('songs'));

?>

