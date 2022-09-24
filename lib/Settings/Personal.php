<?php

declare(strict_types=1);

/**
 * @author Frank de Lange
 * @copyright 2022 Frank de Lange
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

namespace OCA\Files_Reader\Settings;

use OCA\Files_Reader\AppInfo\Application;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IUserSession;
use OCP\IConfig;
use OCP\Settings\ISettings;

class Personal implements ISettings {
        private IConfig $config;
        private string $userId;

        public function __construct(IConfig $config, string $userId) {
                $this->config = $config;
                $this->userId = $userId;
        }

        public function getForm(): TemplateResponse {
		$parameters = [
			'epub_enable' => $this->config->getUserValue($this->userId, Application::APP_ID, 'epub_enable', 'false'),
			'pdf_enable' => $this->config->getUserValue($this->userId, Application::APP_ID, 'pdf_enable', 'false'),
			'cbx_enable' => $this->config->getUserValue($this->userId, Application::APP_ID, 'cbx_enable', 'false')
		];
                return new TemplateResponse(Application::APP_ID, 'personal', $parameters);
        }

        public function getSection(): string {
                return 'additional';
        }

        public function getPriority(): int {
                return 90;
        }
}

