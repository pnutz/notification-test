<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

use AppBundle\Entity\Notification;

class NotificationController extends Controller
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Session
     */
    protected $session;

    /**
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $serializer;

    /**
     * @var string
     */
    protected $SESS_NOTIFICATION_KEY = 'notifications_sent';
    
    public function initialize()
    {
        $this->session = $this->get('session');
        $this->session->start();

        $this->em = $this->getDoctrine()->getManager();

        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @Route("/notification", name="notification")
     * @Method({"GET"})
     */
    public function viewAction(Request $request)
    {
        $this->initialize();

        $queryBuilder = $this->em->getRepository('AppBundle:Notification')->createQueryBuilder('n')
            ->where('n.active = true')
            ->andWhere(':now BETWEEN n.validFrom AND n.validTo')
            ->setParameter('now', new \DateTime());

        if ($request->query->get('after')) {
            $queryBuilder->andWhere('n.id > :after')
                         ->setParameter('after', $request->query->get('after'));
        }

        $notificationsSent = $this->session->get($this->SESS_NOTIFICATION_KEY);
        if (is_array($notificationsSent) && count($notificationsSent) > 0) {
            $queryBuilder->andWhere('n.id NOT IN (:ids)')
                         ->setParameter('ids', $notificationsSent);
        }

        $notifications = $queryBuilder->getQuery()->getResult();

        $this->updateNotificationsSent($notifications);

        $notifications = $this->serializer->normalize($notifications);
        return new JsonResponse($notifications);
    }

    /**
     * @Route("/notification/all", name="notification-all")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $this->initialize();

        $notifications = $this->em->getRepository('AppBundle:Notification')->findAll();

        $notifications = $this->serializer->normalize($notifications);
        return new JsonResponse($notifications);
    }

    /**
     * @Route("/notification/new", name="notification-new")
     * @Method({"POST"})
     */
    public function newAction(Request $request)
    {
        $this->initialize();

        $content = $request->getContent();
        $content = json_decode($content, true);
        
        $notification = new Notification();
        $notification->setTitle($content['title']);
        $notification->setMessage($content['message']);
        $notification->setValidTo(new \DateTime($content['validTo']));
        $notification->setValidFrom(new \DateTime($content['validFrom']));
        $notification->setActive($content['active']);

        $this->em->persist($notification);
        $this->em->flush($notification);

        $notification = $this->serializer->normalize($notification);
        return new JsonResponse($notification);
    }

    /**
     * @Route("/notification/{id}", name="notification-edit")
     * @Method({"POST","PUT"})
     */
    public function editAction(Request $request, $id)
    {
        $this->initialize();

        $notification = $this->em->getRepository('AppBundle:Notification')->find($id);
        if (!$notification) {
            $this->createNotFoundException('Notification not found');
        }

        $content = $request->getContent();
        $content = json_decode($content, true);
        
        $notification->setTitle($content['title']);
        $notification->setMessage($content['message']);
        $notification->setValidTo(new \DateTime($content['validTo']));
        $notification->setValidFrom(new \DateTime($content['validFrom']));
        $notification->setActive($content['active']);

        $this->em->persist($notification);
        $this->em->flush($notification);

        $notification = $this->serializer->normalize($notification);
        return new JsonResponse($notification);
    }

    /**
     * Updates the session notification list
     *
     * @param array $notifications
     */
    protected function updateNotificationsSent(array $notifications)
    {
        $key = $this->SESS_NOTIFICATION_KEY;
        $currentIds = $this->session->get($key);
        $newIds = [];

        /** @var Notification $notification */
        foreach ($notifications as $notification) {
            $newIds[] = $notification->getId();
        }

        if (is_array($currentIds)) {
            $newIds = array_unique(array_merge($newIds, $currentIds));
        }

        $this->session->set($key, $newIds);
    }
}
