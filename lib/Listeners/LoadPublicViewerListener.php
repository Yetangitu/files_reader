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
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class LoadPublicViewerListener implements IEventListener {
        private IInitialState $initialStateService;

        public function __construct(
                IInitialState $initialStateService,
        ) {
                $this->initialStateService = $initialStateService;
        }

        public function handle(Event $event): void {
                if (!$event instanceof BeforeTemplateRenderedEvent) {
                        return;
                }

                // Make sure we are on a public page rendering
                if ($event->getResponse()->getRenderAs() !== TemplateResponse::RENDER_AS_PUBLIC) {
                        return;
                }
                $this->initialStateService->provideInitialState('epub_enabled', 'true');
                $this->initialStateService->provideInitialState('pdf_enabled', 'true');
                $this->initialStateService->provideInitialState('cbx_enabled', 'true');
                Util::addScript(Application::APP_ID, 'plugin-public');
        }
}
