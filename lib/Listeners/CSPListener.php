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

use OCP\AppFramework\Http\EmptyContentSecurityPolicy;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

class CSPListener implements IEventListener {
        public function handle(Event $event): void {
                if (!$event instanceof AddContentSecurityPolicyEvent) {
                        return;
                }

                $csp = new EmptyContentSecurityPolicy();
                $csp->addAllowedFrameDomain('\'self\'');
                $event->addPolicy($csp);
        }
}
