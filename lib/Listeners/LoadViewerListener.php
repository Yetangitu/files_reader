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

namespace OCA\Files_Reader\Listeners;

use OCA\Files_Reader\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;
use OCP\IConfig;
use OCP\IUserSession;

class LoadViewerListener implements IEventListener {
	private IInitialState $initialStateService;
        private IConfig $config;
        private string $userId;

	

        public function __construct(
                IInitialState $initialStateService,
		IConfig $config,
		string $userId
        ) {
                $this->initialStateService = $initialStateService;
		$this->config = $config;
		$this->userId = $userId;
        }

        public function handle(Event $event): void {
                if (!($event instanceof LoadViewer || $event instanceof LoadAdditionalScriptsEvent)) {
                        return;
                }
		$this->initialStateService->provideInitialState('epub_enabled', $this->config->getUserValue($this->userId, Application::APP_ID, 'epub_enable'));
		$this->initialStateService->provideInitialState('pdf_enabled', $this->config->getUserValue($this->userId, Application::APP_ID, 'pdf_enable'));
		$this->initialStateService->provideInitialState('cbx_enabled', $this->config->getUserValue($this->userId, Application::APP_ID, 'cbx_enable'));
                Util::addScript(Application::APP_ID, 'plugin');
        }
}
