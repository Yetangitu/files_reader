<?php

declare(strict_types=1);

/**
 * @author Frank de Lange
 * @copyright 2018 Frank de Lange
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

script('files_reader', 'settings');
style('files_reader', 'settings');

?>

<div id="files_reader" class="section">
	<table><tr><td><h2><?php p($l->t('Reader'));?></h2></td><td>&nbsp;<span class="msg"></span></td></tr></table>
	<p class="settings-hint"><?php p($l->t('Select file types for which Reader should be the default viewer.')); ?></p>

	<p>
		<input type="checkbox" name="epub_enable" id="epub_enable" class="checkbox"
			   value="1" <?php if ($_['epub_enable'] === "true") print_unescaped('checked="checked"'); ?> />
		<label for="epub_enable">
			<?php p($l->t('Epub'));?>
		</label>
	</p>

	<p>
		<input type="checkbox" name="pdf_enable" id="pdf_enable" class="checkbox"
			   value="1" <?php if ($_['pdf_enable'] === "true") print_unescaped('checked="checked"'); ?> />
		<label for="pdf_enable">
			<?php p($l->t('PDF'));?>
		</label><br/>
	</p>
	<p>
		<input type="checkbox" name="cbx_enable" id="cbx_enable" class="checkbox"
			   value="1" <?php if ($_['cbx_enable'] === "true") print_unescaped('checked="checked"'); ?> />
		<label for="cbx_enable">
			<?php p($l->t('CBR/CBZ'));?>
		</label><br/>
	</p>
</div>
