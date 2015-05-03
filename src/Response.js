'use strict';

var I = require('immutable');
var _ = require('ramda');

var Response = I.Record({
    statusCode: undefined,
    statusMessage: '',
    headers: I.Map({}),
    body: ''
});

var response = _.curry(function(statusCode, statusMessage, body){
   return Response({
       statusCode: statusCode,
       statusMessage: statusMessage,
       body: body
   });
});


// Standard Status Helpers
Response.Continue = response('100', 'Continue');
Response.SwitchingProtocols = response('101', 'Switching Protocols');
Response.Processing = response('102', 'Processing');

Response.OK = response('200', 'OK');
Response.Created = response('201', 'Created');
Response.Accepted = response('202', 'Accepted');
Response.NonAuthoritativeInformation = response('203', 'Non-Authoritative Information');
Response.NoContent = response('204', 'No Content');
Response.ResetContent = response('205', 'Reset Content');
Response.PartialContent = response('206', 'Partial Content');
Response.MultiStatus = response('207', 'Multi-Status');

Response.MultipleChoices = response('300', 'Multiple Choices');
Response.MovedPermanently = response('301', 'Moved Permanently');
Response.MovedTemporarily = response('302', 'Moved Temporarily');
Response.SeeOther = response('303', 'See Other');
Response.NotModified = response('304', 'Not Modified');
Response.UseProxy = response('305', 'Use Proxy');
Response.TemporaryRedirect = response('307', 'Temporary Redirect');
Response.PermanentRedirect = response('308', 'Permanent Redirect');

Response.BadRequest = response('400', 'Bad Request');
Response.Unauthorized = response('401', 'Unauthorized');
Response.PaymentRequired = response('402', 'Payment Required');
Response.Forbidden = response('403', 'Forbidden');
Response.NotFound = response('404', 'Not Found');
Response.MethodNotAllowed = response('405', 'Method Not Allowed');
Response.NotAcceptable = response('406', 'Not Acceptable');
Response.ProxyAuthenticationRequired = response('407', 'Proxy Authentication Required');
Response.RequestTimeout = response('408', 'Request Time-out');
Response.Conflict = response('409', 'Conflict');
Response.Gone = response('410', 'Gone');
Response.LengthRequired = response('411', 'Length Required');
Response.PreconditionFailed = response('412', 'Precondition Failed');
Response.RequestEntityTooLarge = response('413', 'Request Entity Too Large');
Response.RequestURITooLarge = response('414', 'Request-URI Too Large');
Response.UnsupportedMediaType = response('415', 'Unsupported Media Type');
Response.RequestedRangeNotSatisfiable = response('416', 'Requested Range Not Satisfiable');
Response.ExpectationFailed = response('417', 'Expectation Failed');
Response.ImATeapot = response('418', 'I\'m a teapot');
Response.UnprocessableEntity = response('422', 'Unprocessable Entity');
Response.Locked = response('423', 'Locked');
Response.FailedDependency = response('424', 'Failed Dependency');
Response.UnorderedCollection = response('425', 'Unordered Collection');
Response.UpgradeRequired = response('426', 'Upgrade Required');
Response.PreconditionRequired = response('428', 'Precondition Required');
Response.TooManyRequests = response('429', 'Too Many Requests');
Response.RequestHeaderFieldsTooLarge = response('431', 'Request Header Fields Too Large');

Response.InternalServerError = response('500', 'Internal Server Error');
Response.NotImplemented = response('501', 'Not Implemented');
Response.BadGateway = response('502', 'Bad Gateway');
Response.ServiceUnavailable = response('503', 'Service Unavailable');
Response.GatewayTimeout = response('504', 'Gateway Time-out');
Response.HTTPVersionNotSupported = response('505', 'HTTP Version Not Supported');
Response.VariantAlsoNegotiates = response('506', 'Variant Also Negotiates');
Response.InsufficientStorage = response('507', 'Insufficient Storage');
Response.BandwidthLimitExceeded = response('509', 'Bandwidth Limit Exceeded');
Response.NotExtended = response('510', 'Not Extended');
Response.NetworkAuthenticationRequired = response('511', 'Network Authentication Required');

module.exports = Response;