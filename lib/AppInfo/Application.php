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

namespace OCA\Files_Reader\AppInfo;

use OCA\Files_Reader\Hooks;
use OCA\Files_Reader\Listeners\CSPListener;
use OCA\Files_Reader\Listeners\LoadPublicViewerListener;
use OCA\Files_Reader\Listeners\LoadViewerListener;

use OCA\Viewer\Event\LoadViewer;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

class Application extends App implements IBootstrap {
        public const APP_ID = 'files_reader';

        public function __construct() {
                parent::__construct(self::APP_ID);
	}

        public function register(IRegistrationContext $context): void {
                $context->registerEventListener(LoadViewer::class, LoadViewerListener::class);
                $context->registerEventListener(BeforeTemplateRenderedEvent::class, LoadPublicViewerListener::class);
                $context->registerEventListener(AddContentSecurityPolicyEvent::class, CSPListener::class);
        }

        public function registerPersonalSettings() {
                \OCP\App::registerPersonal(self::APP_ID, 'personal');
        }

        public function boot(IBootContext $context): void {
		Hooks::register();
        }
}

