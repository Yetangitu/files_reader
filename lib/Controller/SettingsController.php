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

namespace OCA\Files_Reader\Controller;

use OCA\Files_Reader\AppInfo\Application;

use OCP\IL10N;
use OCP\IConfig;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;

class SettingsController extends Controller {
    protected IConfig $config;
    protected Il10n $l10n;
    protected string $userId;

    public function __construct(
        IRequest $request,
        IConfig $config,
        string $userId,
        IL10N $l10n) {
                parent::__construct(Application::APP_ID, $request);
                $this->config = $config;
                $this->userId = $userId;
                $this->l10n = $l10n;
        }

        public function personal(string $epub_enable, string $pdf_enable, string $cbx_enable) {

                $this->config->setUserValue(
                        $this->userId, Application::APP_ID, 'epub_enable', $epub_enable
                );

                $this->config->setUserValue(
                        $this->userId, Application::APP_ID, 'pdf_enable', $pdf_enable
                );

                $this->config->setUserValue(
                        $this->userId, Application::APP_ID, 'cbx_enable', $cbx_enable
                );

                return new DataResponse([
                        'data' => [
                                'message' => $this->l10n->t('Your settings have been updated.'),
                        ],
                ]);
        }
}
